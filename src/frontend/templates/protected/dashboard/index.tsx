import React from 'react'
import { navigate } from 'gatsby'

import { AuthService, AuthConsumer } from '../../../services/authentication'
import { DocumentsList } from './DocumentsList'

interface ContentProps {
  authService: AuthService
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { isAuthenticated, session } = authService
  const goToNewDocument = () => navigate('/protected/create-document')
  const goToCancelDocument = () => navigate('/protected/cancel-document')
  const goToNewDeposit = () => navigate('/protected/create-deposit')

  if (isAuthenticated() && session) {
    return (
      <section>
        <h1>Hello {session.FirstName}!</h1>
        <button type="button" onClick={goToNewDocument}>
          Create document
        </button>
        <button type="button" onClick={goToCancelDocument}>
          Cancel document
        </button>
        <button type="button" onClick={goToNewDeposit}>
          Create deposit
        </button>
        <DocumentsList />
      </section>
    )
  }

  throw new Error('ERROR WHILE RENDERING Dashboard COMPONENT')
}

interface Props {
  path?: '/dashboard'
}

const Dashboard: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default Dashboard
