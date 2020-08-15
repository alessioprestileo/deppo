import { useState, useEffect } from 'react'

import { AuthService, Status } from './AuthService'

export const useAuthStatus = (authService: AuthService): Status => {
  const {
    status,
    subscribeStatusListener: subscribeInitializationStatusListener,
    unsubscribeStatusListener: unsubscribeInitializationStatusListener,
  } = authService
  const [authStatus, setAuthStatus] = useState<Status>(status)
  const handleNewStatus = (newStatus: any) => {
    setAuthStatus(newStatus)
  }
  useEffect(() => {
    subscribeInitializationStatusListener(handleNewStatus)
    return () => unsubscribeInitializationStatusListener(handleNewStatus)
  }, [])

  return authStatus
}
