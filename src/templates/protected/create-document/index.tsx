import React from 'react'
import { navigate } from 'gatsby'

import { BackToDashbooard } from '../../../components'
import {
  AuthConsumer,
  AuthService,
  useAuthStatus,
} from '../../../services/authentication'
import { createDocument } from '../../../services/document-service'
import { newDocument } from './newDocument'

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
  const handleCreate = async () => {
    const res = await createDocument({ token, userId, payload: newDocument })
    if (res.success) {
      navigate('/protected/documents-list')
    }
  }

  return (
    <>
      <BackToDashbooard />
      {Object.entries(newDocument).map(([key, value]) => (
        <div key={key}>
          <span>
            <strong>{`${key}:  `}</strong>
          </span>
          <span>
            {typeof value === 'string' ? value : JSON.stringify(value)}
          </span>
        </div>
      ))}
      <button type="button" onClick={handleCreate}>
        Create
      </button>
    </>
  )
}
interface Props {
  path?: '/user-details'
}

const CreateDocument: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default CreateDocument
