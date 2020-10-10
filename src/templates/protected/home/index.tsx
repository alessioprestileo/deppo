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
  const { createSession, isAuthenticated, isInProgress, session } = authService
  useAuthStatus(authService)
  const goToDashboard = () => navigate('/protected/dashboard')
  const handleLogin = async () => {
    await createSession()
    if (authService.createSessionUrl && isClientSide()) {
      window.location.href = authService.createSessionUrl
    }
  }

  if (!isAuthenticated()) {
    handleLogin()
    return null
  }

  if (isAuthenticated() && session) {
    goToDashboard()
    return null
  }

  if (isInProgress()) {
    return <div>LOADING...</div>
  }

  throw new Error('ERROR WHILE RENDERING Home COMPONENT')
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
