import { Status } from './AuthService'
import { SessionManager } from './SessionManager'
import { TokenManager } from './TokenManager'

export type StatusListener = (initializationStatus: Status) => void

export class AuthManager {
  private static instance: AuthManager
  private _status: Status
  private _statusListeners: StatusListener[] = []
  sessionManager: SessionManager
  tokenManager: TokenManager

  static getInstance = () => {
    if (AuthManager.instance) return AuthManager.instance

    return new AuthManager()
  }

  private constructor() {
    this.tokenManager = new TokenManager(this)
    this.sessionManager = new SessionManager(this)
  }

  private notifyStatusListeners = (): void => {
    this._statusListeners.forEach((fun) => fun(this._status))
  }

  get status() {
    return this._status
  }

  get statusListeners() {
    return this._statusListeners
  }

  updateStatus = (status: Status): void => {
    this._status = status
    this.notifyStatusListeners()
  }
}
