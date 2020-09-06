import React, { useState } from 'react'

import {
  AuthConsumer,
  AuthService,
  useAuthStatus,
} from '../../../services/authentication'
import {
  createDocument,
  retrieveCreatedDocuments,
  RetrieveDocumentPayload,
} from '../../../services/document-service'
import { newDocument } from './newDocument'

interface ContentProps {
  authService: AuthService
}

const useFetchCreatedDocuments = () => {
  const [createdDocuments, setCreatedDocuments] = useState<
    RetrieveDocumentPayload[]
  >([])
  const fetchCreatedDocuments = async (token: string, userId: string) => {
    const res = await retrieveCreatedDocuments({ token, userId })
    const { documents } = await res.json()
    setCreatedDocuments(documents)
  }

  return { fetchCreatedDocuments, createdDocuments }
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const authStatus = useAuthStatus(authService)
  const { session, tokenInfo } = authService
  const token = tokenInfo?.token
  const { fetchCreatedDocuments, createdDocuments } = useFetchCreatedDocuments()

  if (authStatus === 'SESSION_FETCHING_IN_PROGRESS') {
    return <div>LOADING...</div>
  }

  if (!session || !token) return <div>OOPS, SOMETHING WENT WRONG</div>

  const userId = session.SocialSecurityNumber
  const handleCreate = async () => {
    await createDocument({ token, userId, payload: newDocument })
  }
  const handleRefreshList = () => {
    fetchCreatedDocuments(token, userId)
  }

  return (
    <>
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
      <div>
        <div>
          <strong>All my documents:</strong>
          total ({createdDocuments.length})
        </div>
        <button type="button" onClick={handleRefreshList}>
          Refresh list
        </button>
      </div>
      {createdDocuments.map((doc) => (
        <>
          <div key={doc.documentId}>
            {Object.entries(doc).map(([key, value]) => (
              <div key={key}>
                <span>
                  <strong>{`${key}:  `}</strong>
                </span>
                <span>
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </span>
              </div>
            ))}
          </div>
          <br />
        </>
      ))}
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
