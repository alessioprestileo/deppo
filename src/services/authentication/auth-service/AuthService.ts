import { requestWithTimeout } from '../../../shared/utils'
import { SessionCreateResponse } from '../types'
import { AuthManager } from './AuthManager'

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
  private authManager: AuthManager
  private static instance: AuthService

  static getInstance = () => {
    if (AuthService.instance) return AuthService.instance

    return new AuthService()
  }

  private constructor() {
    this.authManager = AuthManager.getInstance()
  }

  get tokenInfo() {
    return this.authManager.tokenManager.tokenInfo
  }

  get createSessionUrl() {
    return this.authManager.sessionManager.createSessionUrl
  }

  get session() {
    return this.authManager.sessionManager.session
  }

  get status() {
    return this.authManager.status
  }

  hasValidToken = (): boolean => {
    const { tokenInfo, tokenHasExpired } = this.authManager.tokenManager

    return !!tokenInfo && !tokenHasExpired(tokenInfo)
  }

  isAuthenticated = (): boolean =>
    this.authManager.sessionManager.sessionId !== undefined

  isInProgress = (): boolean =>
    this.authManager.status === 'SESSION_CREATION_IN_PROGRESS' ||
    this.authManager.status === 'TOKEN_RETRIEVAL_IN_PROGRESS' ||
    this.authManager.status === 'SESSION_FETCHING_IN_PROGRESS' ||
    this.authManager.status === 'SESSION_INVALIDATION_IN_PROGRESS'

  createSession = async (destinationAfterSuccess?: string): Promise<void> => {
    const { token } = await this.authManager.tokenManager.getValidToken()

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
      this.authManager.updateStatus('SESSION_CREATION_ABORTED')
      throw new Error('COULD NOT CREATE AUTHENTICATION SESSION')
    }

    const resBody = (await res.json()) as SessionCreateResponse
    this.authManager.updateStatus('SESSION_CREATION_IN_PROGRESS')
    this.authManager.sessionManager.sessionId = resBody.RequestId
    this.authManager.sessionManager.saveTempSessionId()
    this.authManager.sessionManager.createSessionUrl = resBody.Url
  }

  logout = async (): Promise<void> => {
    const { sessionId } = this.authManager.sessionManager
    if (!sessionId) return

    this.authManager.updateStatus('SESSION_INVALIDATION_IN_PROGRESS')
    const { token } = await this.authManager.tokenManager.getValidToken()
    const reqBody = {
      RequestId: sessionId,
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
      this.authManager.sessionManager.sessionId = undefined
      this.authManager.sessionManager.clearSessionIdFromStorage()
      this.authManager.updateStatus('SESSION_INVALIDATED')
      this.authManager.updateStatus('INITIAL')

      return
    }

    this.authManager.updateStatus('SESSION_INVALIDATION_ABORTED')
    throw new Error('COULD NOT INVALIDATE AUTHENTICATION SESSION')
  }

  finalizeSessionCreation = async (): Promise<void> => {
    this.authManager.sessionManager.saveSessionId()
    this.authManager.sessionManager.fetchSession()
  }

  subscribeStatusListener = (listener: StatusListener): void => {
    if (!this.authManager.statusListeners.includes(listener)) {
      this.authManager.statusListeners.push(listener)
    }
  }

  unsubscribeStatusListener = (listener: StatusListener): void => {
    const index = this.authManager.statusListeners.indexOf(listener)
    if (index !== -1) {
      this.authManager.statusListeners.splice(index, 1)
    }
  }
}
