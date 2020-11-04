import React from 'react'
import { navigate } from 'gatsby'

import { AuthConsumer } from './AuthProvider'
import { RouteComponentProps } from '../../shared/types'
import { useAuthStatus } from './useAuthStatus'
import { AuthService } from './auth-service/AuthService'

interface ContentProps extends Props {
  authService: AuthService
  component: React.ComponentType
}

const Content: React.FC<ContentProps> = ({
  authService,
  component: Component,
  ...otherProps
}) => {
  const { isAuthenticated, isInProgress } = authService
  const authStatus = useAuthStatus(authService)
  const goToHome = () => navigate('/')
  if (authStatus === 'SESSION_INVALIDATED') {
    goToHome()
    return null
  }

  if (isInProgress() || authStatus === 'INITIAL') {
    return <div>LOADING...</div>
  }

  if (!isAuthenticated() || authStatus === 'SESSION_CREATION_ABORTED') {
    throw new Error('ERROR WHILE RENDERING PrivateRoute COMPONENT')
  }

  return <Component {...otherProps} />
}

interface Props extends RouteComponentProps {
  component: React.ComponentType
  path?: string
}

const PrivateRoute: React.FC<Props> = ({ component, ...otherProps }) => (
  <AuthConsumer>
    {(authService) => (
      <Content
        authService={authService}
        component={component}
        {...otherProps}
      />
    )}
  </AuthConsumer>
)

export default PrivateRoute
