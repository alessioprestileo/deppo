import React from 'react'
import { navigate } from 'gatsby'

import {
  AuthService,
  AuthConsumer,
  useHasValidToken,
} from '../../../services/authentication/deppo-backend'
import { isClientSide } from '../../../shared/utils'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { createSession, isAuthenticated } = authService
  const authStatus = useHasValidToken(authService)
  const goToUserDetails = () => navigate('/protected/user-details')
  const handleLogin = async () => {
    await createSession()
    if (authService.createSessionUrl && isClientSide()) {
      window.location.href = authService.createSessionUrl
    }
  }
  const handleLogout = () => {
    authService.logout()
  }

  if (!authStatus || authStatus === 'TOKEN_RETRIEVAL_IN_PROGRESS')
    return <div>LOADING...</div>
  if (authStatus === 'TOKEN_RETRIEVAL_ABORTED')
    return <div>OOPS, SOMETHING WENT WRONG!</div>

  return isAuthenticated() ? (
    <section>
      <h1>Hello !</h1>
      <button type="button" onClick={goToUserDetails}>
        User Details
      </button>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </section>
  ) : (
    <div>
      <h1>Welcome to the protected area</h1>
      <div>
        <button type="button" onClick={handleLogin}>
          Log in
        </button>
      </div>
    </div>
  )
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
