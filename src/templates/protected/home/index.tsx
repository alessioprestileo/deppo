import React from 'react'
import { navigate } from 'gatsby'

import {
  AuthService,
  AuthConsumer,
  useIsAuthenticated,
} from '../../../services/authentication/deppo-backend'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { isAuthenticated, authStatus } = useIsAuthenticated(authService)
  const goToUserDetails = () => navigate('/protected/user-details')
  const handleLoginClick = () => {
    /* empty */
  }
  const handleLogout = () => {
    /* empty */
  }

  if (!authStatus || authStatus === 'IN_PROGRESS') return <div>LOADING...</div>

  return isAuthenticated ? (
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
        <button type="button" onClick={handleLoginClick}>
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
