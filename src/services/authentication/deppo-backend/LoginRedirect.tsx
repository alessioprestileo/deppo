import React from 'react'
import { navigate } from 'gatsby'
// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'query-string'

import { AuthConsumer } from './AuthProvider'
import { AuthService } from './AuthService'
import { RouteComponentProps } from '../../../shared/types'

interface ContentProps extends RouteComponentProps {
  authService: AuthService
}

const Content: React.FC<ContentProps> = ({ authService, location }) => {
  const searchString = location?.search
  if (!searchString) {
    return <div>OOPS, SOMETHING WENT WRONG!</div>
  }

  const queryParams = parse(searchString)
  if (queryParams.error) {
    return <div>There has been an error! Please try again.</div>
  }

  if (queryParams.abort) {
    return <div>Login session was aborted! Please try again.</div>
  }

  authService.finalizeSessionCreation()
  if (
    queryParams.destination &&
    typeof queryParams.destination === 'string' &&
    queryParams.destination !== 'undefined'
  ) {
    navigate(queryParams.destination)
    return null
  }

  navigate('/protected')

  return null
}

const LoginRedirect: React.FC<RouteComponentProps> = (props) => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} {...props} />}
  </AuthConsumer>
)

export default LoginRedirect
