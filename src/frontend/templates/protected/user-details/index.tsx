import React from 'react'

import { AuthConsumer, AuthService } from '../../../services/authentication'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { session } = authService

  if (!session) throw new Error('ERROR WHILE RENDERING UserDetails COMPONENT')

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

const UserDetails: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default UserDetails
