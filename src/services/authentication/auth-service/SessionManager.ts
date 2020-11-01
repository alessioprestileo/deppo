import axios, { AxiosPromise } from 'axios'

import { hasLocalStorage, requestWithTimeout } from '../../../shared/utils'
import { SessionCreateResponse, SessionFetchResponse } from '../types'
import { AuthManager } from './AuthManager'

export class SessionManager {
  createSessionUrl?: string
  sessionId?: string
  private _session?: SessionFetchResponse

  constructor(private master: AuthManager) {
    const storedSessionId = SessionManager.retrieveSessionIdFromStorage()
    if (storedSessionId) {
      this.sessionId = storedSessionId
      this.master.updateStatus('SESSIONID_RETRIEVAL_SUCESSFUL')
      this.master.updateStatus('SESSION_FETCHING_IN_PROGRESS')
      this.fetchSession()
        .then(() => this.master.updateStatus('SESSION_FETCHING_SUCCESSFUL'))
        .catch(() => this.master.updateStatus('SESSION_FETCHING_ABORTED'))
    }
  }

  private static retrieveSessionIdFromStorage = (): string | false | null => {
    const sessionId = hasLocalStorage() && localStorage.getItem('sessionId')

    return sessionId
  }

  private static retrieveTempSessionIdFromStorage = ():
    | string
    | false
    | null => {
    const tempSessionId =
      hasLocalStorage() && localStorage.getItem('tempSessionId')

    return tempSessionId
  }

  fetchSession = async (): Promise<void> => {
    const { token } = await this.master.tokenManager.getValidToken()
    if (!this.sessionId) {
      throw new Error('COULD NOT FETCH SESSION: MISSING SESSION ID')
    }

    this.master.updateStatus('SESSION_FETCHING_IN_PROGRESS')
    const res = await requestWithTimeout<AxiosPromise<SessionFetchResponse>>(
      axios({
        url: '/.netlify/functions/fetchSession',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'session-id': this.sessionId,
        },
      }),
    )

    if (res === 'expired') {
      this.master.updateStatus('SESSION_FETCHING_ABORTED')
      throw new Error('COULD NOT FETCH SESSION')
    }

    const resBody = res.data
    this._session = resBody
    this.master.updateStatus('SESSION_FETCHING_SUCCESSFUL')
  }

  saveSessionId = (): void => {
    if (hasLocalStorage()) {
      const tempSessionId = SessionManager.retrieveTempSessionIdFromStorage()
      if (!tempSessionId) {
        this.master.updateStatus('SESSION_CREATION_ABORTED')
      }

      this.sessionId = tempSessionId as string
      localStorage.setItem('sessionId', tempSessionId as string)
      localStorage.removeItem('tempSessionId')
    }
    this.master.updateStatus('SESSION_CREATION_SUCCESSFUL')
  }

  get session() {
    return this._session
  }

  createSession = async (destinationAfterSuccess?: string): Promise<void> => {
    const { token } = await this.master.tokenManager.getValidToken()

    const reqBody = {
      destination: destinationAfterSuccess,
    }
    const res = await requestWithTimeout<AxiosPromise<SessionCreateResponse>>(
      axios({
        url: '/.netlify/functions/createSession',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: reqBody,
      }),
    )

    if (res === 'expired') {
      this.master.updateStatus('SESSION_CREATION_ABORTED')
      throw new Error('COULD NOT CREATE AUTHENTICATION SESSION')
    }

    const resBody = res.data
    this.master.updateStatus('SESSION_CREATION_IN_PROGRESS')
    this.sessionId = resBody.RequestId
    this.saveTempSessionId()
    this.createSessionUrl = resBody.Url
  }

  finalizeSessionCreation = async (): Promise<void> => {
    this.saveSessionId()
    this.fetchSession()
  }

  invalidateSession = (): void => {
    this.sessionId = undefined
    this.clearSessionIdFromStorage()
  }

  saveTempSessionId = (): void => {
    if (hasLocalStorage() && this.sessionId) {
      localStorage.setItem('tempSessionId', this.sessionId)
    }
  }

  clearSessionIdFromStorage = (): void => {
    if (hasLocalStorage()) {
      localStorage.removeItem('sessionId')
    }
  }
}
