import React from 'react'

import { BackToDashboard } from '../../../components'
import { AuthConsumer, AuthService } from '../../../services/authentication'
import { Form } from './Form'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { session, tokenInfo } = authService
  const token = tokenInfo?.token

  if (!session || !token)
    throw new Error('ERROR WHILE RENDERING CancelDocument COMPONENT')

  const creatorId = session.SocialSecurityNumber

  return (
    <>
      <BackToDashboard />
      <div>
        <div>
          <strong>Which document would you like to cancel?</strong>
        </div>
        <div>
          <Form creatorId={creatorId} token={token} />
        </div>
      </div>
    </>
  )
}
interface Props {
  path?: '/cancel-document'
}

const CancelDocument: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default CancelDocument
