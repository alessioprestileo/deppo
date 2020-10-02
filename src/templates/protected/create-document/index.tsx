import React from 'react'

import { BackToDashboard } from '../../../components'
import {
  AuthConsumer,
  AuthService,
  useAuthStatus,
} from '../../../services/authentication'
import { Form } from './Form'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const authStatus = useAuthStatus(authService)
  const { session, tokenInfo } = authService
  const token = tokenInfo?.token

  if (authStatus === 'SESSION_FETCHING_IN_PROGRESS') {
    return <div>LOADING...</div>
  }

  if (!session || !token) return <div>OOPS, SOMETHING WENT WRONG</div>

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

const CreateDocument: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default CreateDocument
