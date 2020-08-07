import { hasSessionStorage } from '../../../shared/utils'
import { TokenInfo, TokenResponse } from './types'

export type InitializationStatus = 'IN_PROGRESS' | 'SUCESSFUL' | 'ABORTED'
export type InitializationStatusListener = (
  initializationStatus: InitializationStatus,
) => void

export class AuthService {
  tokenExpirationTolerance = 5000
  backendUrl = 'http://localhost:5000/v1'
  private _tokenInfo?: TokenInfo
  private initializationStatus: InitializationStatus
  private initializationStatusListeners: InitializationStatusListener[] = []

  constructor() {
    const storedTokenInfo = AuthService.retrieveTokenInfoFromSessionStorage()
    if (storedTokenInfo) {
      this.initializationStatus = 'SUCESSFUL'
      this.notifyInitializationStatusListeners()
      this._tokenInfo = storedTokenInfo
      return
    }

    this.initializationStatus = 'IN_PROGRESS'
    this.notifyInitializationStatusListeners()
    this.fetchToken()
      .then((tokenInfo) => {
        this._tokenInfo = tokenInfo
        this.initializationStatus = 'SUCESSFUL'
        this.notifyInitializationStatusListeners()
      })
      .catch(() => {
        this.initializationStatus = 'ABORTED'
        this.notifyInitializationStatusListeners()
      })
  }

  private static waitFiveSeconds = (): Promise<'expired'> =>
    new Promise((resolve) => {
      setTimeout(() => resolve('expired'), 5000)
    })

  private fetchToken = async (): Promise<TokenInfo> => {
    const apiKey = process.env.GATSBY_DEPPO_BACKEND_API_KEY
    if (!apiKey) {
      throw new Error('Cannot send request to Deppo backend')
    }

    const res = await Promise.race([
      fetch(`${this.backendUrl}/token`, {
        method: 'GET',
        headers: { 'api-key': apiKey },
      }),
      AuthService.waitFiveSeconds(),
    ])

    if (res === 'expired') {
      this.initializationStatus = 'ABORTED'
      this.notifyInitializationStatusListeners()
      throw new Error('COULD NOT INITIALIZE AuthService')
    }

    const body = (await res.json()) as TokenResponse
    const tokenExpires = Date.now() + body.expires_in * 1000
    const token = body.access_token
    const tokenInfo: TokenInfo = { tokenExpires, token }
    this.saveTokenInfo(tokenInfo)

    return tokenInfo
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

  private notifyInitializationStatusListeners = (): void => {
    this.initializationStatusListeners.forEach((fun) =>
      fun(this.initializationStatus),
    )
  }

  get tokenInfo() {
    return this._tokenInfo
  }

  isAuthenticated = (): boolean =>
    !!this._tokenInfo &&
    this._tokenInfo.tokenExpires - Date.now() > this.tokenExpirationTolerance

  subscribeInitializationStatusListener = (
    listener: InitializationStatusListener,
  ): void => {
    if (!this.initializationStatusListeners.includes(listener)) {
      this.initializationStatusListeners.push(listener)
    }
  }

  unsubscribeInitializationStatusListener = (
    listener: InitializationStatusListener,
  ): void => {
    const index = this.initializationStatusListeners.indexOf(listener)
    if (index !== -1) {
      this.initializationStatusListeners.splice(index, 1)
    }
  }
}
