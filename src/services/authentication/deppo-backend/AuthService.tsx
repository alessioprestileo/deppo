import { hasSessionStorage, requestWithTimeout } from '../../../shared/utils'
import { TokenInfo, TokenResponse, SessionCreateResponse } from './types'

export type Status =
  | 'TOKEN_RETRIEVAL_IN_PROGRESS'
  | 'TOKEN_RETRIEVAL_SUCESSFUL'
  | 'TOKEN_RETRIEVAL_ABORTED'
  | 'SESSION_CREATION_ABORTED'
  | 'SESSION_CREATION_IN_PROGRESS'
  | 'SESSION_RETRIEVAL_SUCESSFUL'
  | 'SESSION_CREATION_SUCCESSFUL'
  | 'SESSION_INVALIDATED'
  | 'SESSION_INVALIDATION_ABORTED'

export type StatusListener = (initializationStatus: Status) => void

export class AuthService {
  private _tokenInfo?: TokenInfo
  private deppoApiKey: string
  private statusListeners: StatusListener[] = []
  private _createSessionUrl?: string
  private _sessionId?: string
  private _status: Status
  tokenExpirationTolerance = 5000
  backendUrl = 'http://localhost:5000/v1'

  constructor() {
    this.deppoApiKey = this.getDeppoApiKeyFromEnv()
    const storedTokenInfo = AuthService.retrieveTokenInfoFromSessionStorage()
    if (storedTokenInfo) {
      this.updateStatus('TOKEN_RETRIEVAL_SUCESSFUL')
      this._tokenInfo = storedTokenInfo

      const storedSessionId = AuthService.retrieveSessionIdFromSessionStorage()
      if (storedSessionId) {
        this.updateStatus('SESSION_RETRIEVAL_SUCESSFUL')
        this._sessionId = storedSessionId

        return
      }

      return
    }

    this.updateStatus('TOKEN_RETRIEVAL_IN_PROGRESS')
    this.fetchToken()
      .then(() => this.updateStatus('TOKEN_RETRIEVAL_SUCESSFUL'))
      .catch(() => this.updateStatus('TOKEN_RETRIEVAL_ABORTED'))
  }

  private updateStatus = (status: Status): void => {
    this._status = status
    this.notifyStatusListeners()
  }

  private getDeppoApiKeyFromEnv = (): string => {
    const deppoApiKey = process.env.GATSBY_DEPPO_BACKEND_API_KEY
    if (!deppoApiKey) {
      throw new Error('NO VALID KEY FOR Deppo backend')
    }

    return deppoApiKey
  }

  private fetchToken = async (): Promise<void> => {
    const res = await requestWithTimeout(
      fetch('/.netlify/functions/fetchToken', {
        method: 'GET',
      }),
    )

    if (res === 'expired') {
      this.updateStatus('TOKEN_RETRIEVAL_ABORTED')
      throw new Error('COULD NOT INITIALIZE AuthService')
    }

    const body = (await res.json()) as TokenResponse
    const tokenExpires = Date.now() + body.expires_in * 1000
    const token = body.access_token
    const tokenInfo: TokenInfo = { tokenExpires, token }
    this.saveTokenInfo(tokenInfo)
  }

  private static retrieveSessionIdFromSessionStorage = ():
    | string
    | false
    | null => {
    const sessionId = hasSessionStorage() && sessionStorage.getItem('sessionId')

    return sessionId
  }

  private static retrieveTempSessionIdFromSessionStorage = ():
    | string
    | false
    | null => {
    const tempSessionId =
      hasSessionStorage() && sessionStorage.getItem('tempSessionId')

    return tempSessionId
  }

  private static retrieveTokenInfoFromSessionStorage = ():
    | TokenInfo
    | false => {
    const tokenInfoString = hasSessionStorage()
      ? sessionStorage.getItem('tokenInfo')
      : undefined
    const tokenInfo: TokenInfo | false =
      tokenInfoString && JSON.parse(tokenInfoString)

    return tokenInfo
  }

  private saveTokenInfo = (tokenInfo: TokenInfo): void => {
    this._tokenInfo = tokenInfo
    if (hasSessionStorage()) {
      sessionStorage.setItem('tokenInfo', JSON.stringify(tokenInfo))
    }
  }

  private notifyStatusListeners = (): void => {
    this.statusListeners.forEach((fun) => fun(this._status))
  }

  private tokenHasExpired = (tokenInfo: TokenInfo) =>
    tokenInfo.tokenExpires - Date.now() < this.tokenExpirationTolerance

  private ensureTokenIsUpToDate = async (
    tokenInfo: TokenInfo,
  ): Promise<void> => {
    if (this.tokenHasExpired(tokenInfo)) {
      await this.refreshToken()
    }
  }

  private refreshToken = (): Promise<void> => this.fetchToken()

  private getValidToken = async (): Promise<TokenInfo> => {
    if (!this._tokenInfo) {
      await this.fetchToken()
      if (!this._tokenInfo) {
        throw new Error('INVALID STATE')
      }

      return this._tokenInfo
    }

    await this.ensureTokenIsUpToDate(this._tokenInfo)

    return this._tokenInfo
  }

  get tokenInfo() {
    return this._tokenInfo
  }

  get createSessionUrl() {
    return this._createSessionUrl
  }

  get status() {
    return this._status
  }

  hasValidToken = (): boolean =>
    !!this._tokenInfo && !this.tokenHasExpired(this._tokenInfo)

  isAuthenticated = (): boolean => this._sessionId !== undefined

  createSession = async (destinationAfterSuccess?: string): Promise<void> => {
    const { token } = await this.getValidToken()

    const reqBody = {
      destination: destinationAfterSuccess,
    }
    const res = await requestWithTimeout(
      fetch('/.netlify/functions/createSession', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      }),
    )

    if (res === 'expired') {
      this.updateStatus('SESSION_CREATION_ABORTED')
      throw new Error('COULD NOT CREATE AUTHENTICATION SESSION')
    }

    const resBody = (await res.json()) as SessionCreateResponse
    this.updateStatus('SESSION_CREATION_IN_PROGRESS')
    this._sessionId = resBody.RequestId
    this.saveTempSessionId()
    this._createSessionUrl = resBody.Url
  }

  logout = async (): Promise<void> => {
    if (!this._sessionId) return

    const { token } = await this.getValidToken()
    const reqBody = {
      RequestId: this._sessionId,
    }
    const res = await requestWithTimeout(
      fetch(`${this.backendUrl}/invalidate-session`, {
        method: 'PUT',
        headers: {
          'api-key': this.deppoApiKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      }),
    )

    if (res !== 'expired' && res.status === 200) {
      this._sessionId = undefined
      this.clearSessionId()
      this.updateStatus('SESSION_INVALIDATED')

      return
    }

    this.updateStatus('SESSION_INVALIDATION_ABORTED')
    throw new Error('COULD NOT INVALIDATE AUTHENTICATION SESSION')
  }

  finalizeSessionCreation = (): void => {
    this.saveSessionId()
  }

  private saveTempSessionId = (): void => {
    if (hasSessionStorage() && this._sessionId) {
      sessionStorage.setItem('tempSessionId', this._sessionId)
    }
  }

  private clearSessionId = (): void => {
    if (hasSessionStorage()) {
      sessionStorage.removeItem('sessionId')
    }
  }

  private saveSessionId = (): void => {
    if (hasSessionStorage()) {
      const tempSessionId = AuthService.retrieveTempSessionIdFromSessionStorage()
      if (!tempSessionId) {
        this.updateStatus('SESSION_CREATION_ABORTED')
      }

      this._sessionId = tempSessionId as string
      sessionStorage.setItem('sessionId', tempSessionId as string)
      sessionStorage.removeItem('tempSessionId')
    }
    this.updateStatus('SESSION_CREATION_SUCCESSFUL')
  }

  subscribeStatusListener = (listener: StatusListener): void => {
    if (!this.statusListeners.includes(listener)) {
      this.statusListeners.push(listener)
    }
  }

  unsubscribeStatusListener = (listener: StatusListener): void => {
    const index = this.statusListeners.indexOf(listener)
    if (index !== -1) {
      this.statusListeners.splice(index, 1)
    }
  }
}
