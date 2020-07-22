import React from 'react'
import { AuthConsumer } from './AuthProvider'
import { Default } from '../../pages/protected/default/default'

interface Props {
  component: React.ComponentType
  path?: string
}

export const PrivateRoute: React.FC<Props> = ({
  component: Component,
  ...rest
}) => (
  <AuthConsumer>
    {({ isAuthenticated }) => {
      if (isAuthenticated()) {
        return <Component {...rest} />
      }
      return <Default />
    }}
  </AuthConsumer>
)
