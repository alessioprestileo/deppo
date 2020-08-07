import React from 'react'

import { AuthConsumer } from './AuthProvider'
import Home from '../../../templates/protected/home'
import { RouteComponentProps } from '../../../shared/types'
import { useIsAuthenticated } from './useIsAuthenticated'

interface Props extends RouteComponentProps {
  component: React.ComponentType
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {(authService) => {
      const { isAuthenticated, authStatus } = useIsAuthenticated(authService)
      if (isAuthenticated) {
        return <Component {...rest} />
      }
      if (!isAuthenticated && authStatus === 'IN_PROGRESS') {
        return <div>LOADING...</div>
      }
      if (!isAuthenticated && authStatus === 'ABORTED') {
        return <div>ERROR !</div>
      }
      return <Home />
    }}
  </AuthConsumer>
)

export default PrivateRoute
