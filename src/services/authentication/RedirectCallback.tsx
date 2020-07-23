import React from 'react'

import { RouteComponentProps } from '../../shared/types'
import { AuthConsumer } from './AuthProvider'

const RedirectCallback: React.FC<RouteComponentProps> = ({ location }) => (
  <AuthConsumer>
    {({ signinRedirectCallback }) => {
      signinRedirectCallback()

      return location?.search.includes('error') ? (
        <p>There has been an error! Pleas try again.</p>
      ) : (
        <div>LOADING...</div>
      )
    }}
  </AuthConsumer>
)

export default RedirectCallback
