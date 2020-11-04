import axios, { AxiosPromise } from 'axios'

import { hasLocalStorage, requestWithTimeout } from '../../../shared/utils'
import { TokenInfo, TokenResponse } from '../types'
import { AuthManager } from './AuthManager'

export class TokenManager {
  private _tokenInfo?: TokenInfo
  private tokenExpirationTolerance = 5000

  constructor(private master: AuthManager) {
    const storedTokenInfo = TokenManager.retrieveTokenInfoFromStorage()
    if (storedTokenInfo && !this.tokenHasExpired(storedTokenInfo)) {
      this._tokenInfo = storedTokenInfo
      this.master.updateStatus('TOKEN_RETRIEVAL_SUCESSFUL')

      return
    }

    this.clearTokenInfoFromStorage()
    this.master.updateStatus('TOKEN_RETRIEVAL_IN_PROGRESS')
    this.fetchToken()
      .then(() => this.master.updateStatus('TOKEN_RETRIEVAL_SUCESSFUL'))
      .catch(() => this.master.updateStatus('TOKEN_RETRIEVAL_ABORTED'))
  }

  private fetchToken = async (): Promise<void> => {
    const res = await requestWithTimeout<AxiosPromise<TokenResponse>>(
      axios({ url: '/.netlify/functions/fetchToken', method: 'GET' }),
    )

    if (res === 'expired') {
      this.master.updateStatus('TOKEN_RETRIEVAL_ABORTED')
      throw new Error('COULD NOT INITIALIZE AuthService')
    }

    const body = res.data
    const tokenExpires = Date.now() + body.expires_in * 1000
    const token = body.access_token
    const tokenInfo: TokenInfo = { tokenExpires, token }
    this.saveTokenInfo(tokenInfo)
  }

  private static retrieveTokenInfoFromStorage = (): TokenInfo | false => {
    const tokenInfoString = hasLocalStorage()
      ? localStorage.getItem('tokenInfo')
      : undefined
    const tokenInfo: TokenInfo | false =
      tokenInfoString && JSON.parse(tokenInfoString)

    return tokenInfo
  }

  private saveTokenInfo = (tokenInfo: TokenInfo): void => {
    this._tokenInfo = tokenInfo
    if (hasLocalStorage()) {
      localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo))
    }
  }

  private ensureTokenIsUpToDate = async (
    tokenInfo: TokenInfo,
  ): Promise<void> => {
    if (this.tokenHasExpired(tokenInfo)) {
      await this.refreshToken()
    }
  }

  private refreshToken = (): Promise<void> => this.fetchToken()

  private clearTokenInfoFromStorage = (): void => {
    if (hasLocalStorage()) {
      localStorage.removeItem('tokenInfo')
    }
  }

  getValidToken = async (): Promise<TokenInfo> => {
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

  tokenHasExpired = (tokenInfo: TokenInfo) =>
    tokenInfo.tokenExpires - Date.now() < this.tokenExpirationTolerance
}
