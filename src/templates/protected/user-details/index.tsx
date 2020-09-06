import React from 'react'

import {
  AuthConsumer,
  AuthService,
  useAuthStatus,
} from '../../../services/authentication'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const authStatus = useAuthStatus(authService)
  const { session } = authService

  if (authStatus === 'SESSION_FETCHING_IN_PROGRESS') {
    return <div>LOADING...</div>
  }

  if (!session) return <div>NO SESSION TO SHOW</div>

  return (
    <>
      {Object.entries(session).map(([key, value]) => (
        <div key={key}>
          <span>
            <strong>{`${key}:  `}</strong>
          </span>
          <span>
            {typeof value === 'string' ? value : JSON.stringify(value)}
          </span>
        </div>
      ))}
    </>
  )
}
interface Props {
  path?: '/user-details'
}

const Home: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default Home
