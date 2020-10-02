import React from 'react'
import { navigate } from 'gatsby'

import {
  AuthService,
  AuthConsumer,
  useAuthStatus,
} from '../../../services/authentication'
import { isClientSide } from '../../../shared/utils'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { createSession, isAuthenticated, session } = authService
  const authStatus = useAuthStatus(authService)
  const goToHome = () => navigate('/')
  const goToDashboard = () => navigate('/protected/dashboard')
  const handleLogin = async () => {
    await createSession()
    if (authService.createSessionUrl && isClientSide()) {
      window.location.href = authService.createSessionUrl
    }
  }

  if (authStatus === 'SESSION_INVALIDATED') {
    goToHome()
    return null
  }

  if (
    !authStatus ||
    authStatus === 'TOKEN_RETRIEVAL_IN_PROGRESS' ||
    authStatus === 'SESSION_INVALIDATION_IN_PROGRESS'
  ) {
    return <div>LOADING...</div>
  }

  if (authStatus === 'TOKEN_RETRIEVAL_ABORTED') {
    return <div>OOPS, SOMETHING WENT WRONG!</div>
  }

  if (!isAuthenticated()) {
    handleLogin()
    return null
  }

  if (isAuthenticated() && session) {
    goToDashboard()
    return null
  }

  return <div>OOPS, SOMETHING WENT WRONG!</div>
}

interface Props {
  path?: '/'
}

const Home: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default Home
