import React from 'react'

import { RouteComponentProps } from '../../shared/types'
import { AuthConsumer } from './AuthProvider'

const LogoutCallback: React.FC<RouteComponentProps> = ({ location }) => (
  <AuthConsumer>
    {({ signoutRedirectCallback }) => {
      signoutRedirectCallback()

      return location?.search.includes('error') ? (
        <p>There has been an error! Pleas try again.</p>
      ) : (
        <div>LOADING...</div>
      )
    }}
  </AuthConsumer>
)

export default LogoutCallback
