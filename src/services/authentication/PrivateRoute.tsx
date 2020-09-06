import React from 'react'

import { AuthConsumer } from './AuthProvider'
import Home from '../../templates/protected/home'
import { RouteComponentProps } from '../../shared/types'
import { useAuthStatus } from './useAuthStatus'
import { AuthService } from './AuthService'

interface ContentProps extends Props {
  authService: AuthService
  component: React.ComponentType
}

const Content: React.FC<ContentProps> = ({
  authService,
  component: Component,
  ...otherProps
}) => {
  const { isAuthenticated } = authService
  const authStatus = useAuthStatus(authService)
  if (isAuthenticated()) {
    return <Component {...otherProps} />
  }
  if (!isAuthenticated() && authStatus === 'SESSION_CREATION_IN_PROGRESS') {
    return <div>LOADING...</div>
  }
  if (!isAuthenticated() && authStatus === 'SESSION_CREATION_ABORTED') {
    return <div>ERROR !</div>
  }
  return <Home />
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
