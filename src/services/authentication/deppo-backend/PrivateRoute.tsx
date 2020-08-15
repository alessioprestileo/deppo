import React from 'react'

import { AuthConsumer } from './AuthProvider'
import Home from '../../../templates/protected/home'
import { RouteComponentProps } from '../../../shared/types'
import { useAuthStatus } from './useAuthStatus'

interface Props extends RouteComponentProps {
  component: React.ComponentType
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {(authService) => {
      const { hasValidToken } = authService
      const authStatus = useAuthStatus(authService)
      if (hasValidToken()) {
        return <Component {...rest} />
      }
      if (!hasValidToken && authStatus === 'TOKEN_RETRIEVAL_IN_PROGRESS') {
        return <div>LOADING...</div>
      }
      if (!hasValidToken && authStatus === 'TOKEN_RETRIEVAL_ABORTED') {
        return <div>ERROR !</div>
      }
      return <Home />
    }}
  </AuthConsumer>
)

export default PrivateRoute
