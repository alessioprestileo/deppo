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

const CreateDocument: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default CreateDocument
