import React, { useEffect } from 'react'
import { navigate } from 'gatsby'

import { AuthService, AuthConsumer } from '../../../services/authentication'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  useEffect(() => {
    const handleLogout = async () => {
      await authService.logout()
      navigate('/')
    }

    handleLogout()
  }, [])

  return null
}

interface Props {
  path?: '/logout'
}

const Logout: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default Logout
