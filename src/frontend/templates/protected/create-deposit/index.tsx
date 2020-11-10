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

  if (!session || !token) {
    throw new Error('ERROR WHILE RENDERING CreateDeposit COMPONENT')
  }

  const userId = session.SocialSecurityNumber

  return (
    <>
      <BackToDashboard />
      <Form token={token} creatorId={userId} />
    </>
  )
}
interface Props {
  path?: '/create-document'
}

const CreateDeposit: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default CreateDeposit
