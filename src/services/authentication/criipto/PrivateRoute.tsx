import React from 'react'

import { AuthConsumer } from './AuthProvider'
import Home from '../../../templates/protected/home'
import { RouteComponentProps } from '../../../shared/types'

interface Props extends RouteComponentProps {
  component: React.ComponentType
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuthenticated }) => {
      if (isAuthenticated()) {
        return <Component {...rest} />
      }
      return <Home />
    }}
  </AuthConsumer>
)

export default PrivateRoute
