import { useState, useEffect } from 'react'

import { AuthService, InitializationStatus } from './AuthService'

export const useIsAuthenticated = (authService: AuthService) => {
  const [authStatus, setAuthStatus] = useState<InitializationStatus>()
  const handleNewStatus = (newStatus: any) => {
    setAuthStatus(newStatus)
  }
  const {
    isAuthenticated,
    subscribeInitializationStatusListener,
    unsubscribeInitializationStatusListener,
  } = authService
  useEffect(() => {
    subscribeInitializationStatusListener(handleNewStatus)
    return () => unsubscribeInitializationStatusListener(handleNewStatus)
  }, [])

  return { isAuthenticated: isAuthenticated(), authStatus }
}
