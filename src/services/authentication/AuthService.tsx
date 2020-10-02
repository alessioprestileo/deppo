import { hasSessionStorage, requestWithTimeout } from '../../shared/utils'
import {
  TokenInfo,
  TokenResponse,
  SessionCreateResponse,
  SessionFetchResponse,
} from './types'

export type Status =
  | 'INITIAL'
  | 'TOKEN_RETRIEVAL_IN_PROGRESS'
  | 'TOKEN_RETRIEVAL_SUCESSFUL'
  | 'TOKEN_RETRIEVAL_ABORTED'
  | 'SESSION_CREATION_ABORTED'
  | 'SESSION_CREATION_IN_PROGRESS'
  | 'SESSIONID_RETRIEVAL_SUCESSFUL'
  | 'SESSION_CREATION_SUCCESSFUL'
  | 'SESSION_INVALIDATED'
  | 'SESSION_INVALIDATION_ABORTED'
  | 'SESSION_INVALIDATION_IN_PROGRESS'
  | 'SESSION_FETCHING_IN_PROGRESS'
  | 'SESSION_FETCHING_SUCCESSFUL'
  | 'SESSION_FETCHING_ABORTED'

export type StatusListener = (initializationStatus: Status) => void

export class AuthService {
  private _tokenInfo?: TokenInfo
  private statusListeners: StatusListener[] = []
  private _createSessionUrl?: string
  private _sessionId?: string
  private _session?: SessionFetchResponse
  private _status: Status
  private tokenExpirationTolerance = 5000

  constructor() {
    const storedTokenInfo = AuthService.retrieveTokenInfoFromStorage()
    if (storedTokenInfo && !this.tokenHasExpired(storedTokenInfo)) {
      this._tokenInfo = storedTokenInfo
      this.updateStatus('TOKEN_RETRIEVAL_SUCESSFUL')

      const storedSessionId = AuthService.retrieveSessionIdFromStorage()
      if (storedSessionId) {
        this._sessionId = storedSessionId
        this.updateStatus('SESSIONID_RETRIEVAL_SUCESSFUL')
        this.updateStatus('SESSION_FETCHING_IN_PROGRESS')
        this.fetchSession()
          .then(() => this.updateStatus('SESSION_FETCHING_SUCCESSFUL'))
          .catch(() => this.updateStatus('SESSION_FETCHING_ABORTED'))

        return
      }

      return
    }

    this.clearAllStorage()
    this.updateStatus('TOKEN_RETRIEVAL_IN_PROGRESS')
    this.fetchToken()
      .then(() => this.updateStatus('TOKEN_RETRIEVAL_SUCESSFUL'))
      .catch(() => this.updateStatus('TOKEN_RETRIEVAL_ABORTED'))
  }

  private clearAllStorage = () => {
    this.clearTokenInfoFromStorage()
    this.clearSessionIdFromStorage()
  }

  private updateStatus = (status: Status): void => {
    this._status = status
    this.notifyStatusListeners()
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

  private static retrieveSessionIdFromStorage = (): string | false | null => {
    const sessionId = hasSessionStorage() && sessionStorage.getItem('sessionId')

    return sessionId
  }

  private static retrieveTempSessionIdFromStorage = ():
    | string
    | false
    | null => {
    const tempSessionId =
      hasSessionStorage() && sessionStorage.getItem('tempSessionId')

    return tempSessionId
  }

  private static retrieveTokenInfoFromStorage = (): TokenInfo | false => {
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

  get session() {
    return this._session
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

  private fetchSession = async (): Promise<void> => {
    const { token } = await this.getValidToken()
    if (!this._sessionId) {
      throw new Error('COULD NOT FETCH SESSION: MISSING SESSION ID')
    }

    this.updateStatus('SESSION_FETCHING_IN_PROGRESS')
    const res = await requestWithTimeout(
      fetch('/.netlify/functions/fetchSession', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'session-id': this._sessionId,
        },
      }),
    )

    if (res === 'expired') {
      this.updateStatus('SESSION_FETCHING_ABORTED')
      throw new Error('COULD NOT FETCH SESSION')
    }

    const resBody = (await res.json()) as SessionFetchResponse
    this._session = resBody
    this.updateStatus('SESSION_FETCHING_SUCCESSFUL')
  }

  logout = async (): Promise<void> => {
    if (!this._sessionId) return

    this.updateStatus('SESSION_INVALIDATION_IN_PROGRESS')
    const { token } = await this.getValidToken()
    const reqBody = {
      RequestId: this._sessionId,
    }
    const res = await requestWithTimeout(
      fetch('/.netlify/functions/invalidateSession', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      }),
    )

    if (res !== 'expired' && res.status === 200) {
      this._sessionId = undefined
      this.clearSessionIdFromStorage()
      this.updateStatus('SESSION_INVALIDATED')
      this.updateStatus('INITIAL')

      return
    }

    this.updateStatus('SESSION_INVALIDATION_ABORTED')
    throw new Error('COULD NOT INVALIDATE AUTHENTICATION SESSION')
  }

  finalizeSessionCreation = async (): Promise<void> => {
    this.saveSessionId()
    this.fetchSession()
  }

  private saveTempSessionId = (): void => {
    if (hasSessionStorage() && this._sessionId) {
      sessionStorage.setItem('tempSessionId', this._sessionId)
    }
  }

  private clearSessionIdFromStorage = (): void => {
    if (hasSessionStorage()) {
      sessionStorage.removeItem('sessionId')
    }
  }

  private clearTokenInfoFromStorage = (): void => {
    if (hasSessionStorage()) {
      sessionStorage.removeItem('tokenInfo')
    }
  }

  private saveSessionId = (): void => {
    if (hasSessionStorage()) {
      const tempSessionId = AuthService.retrieveTempSessionIdFromStorage()
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
