import React, { useState, useEffect } from 'react'

import { BackToDashbooard } from '../../../components'
import {
  AuthConsumer,
  AuthService,
  useAuthStatus,
} from '../../../services/authentication'
import {
  retrieveCreatedDocuments,
  RetrieveDocumentPayload,
} from '../../../services/document-service'

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

  useEffect(() => {
    if (token && session) {
      const userId = session.SocialSecurityNumber
      fetchCreatedDocuments(token, userId)
    }
  }, [token, session])

  if (authStatus === 'SESSION_FETCHING_IN_PROGRESS') {
    return <div>LOADING...</div>
  }

  if (!session || !token) return <div>OOPS, SOMETHING WENT WRONG</div>

  const userId = session.SocialSecurityNumber
  const handleRefreshList = () => {
    fetchCreatedDocuments(token, userId)
  }

  return (
    <>
      <BackToDashbooard />
      <div>
        <div>
          <strong>All the documents you created:</strong>
          total ({createdDocuments.length})
        </div>
        <button type="button" onClick={handleRefreshList}>
          Refresh list
        </button>
      </div>
      {createdDocuments.map((doc) => (
        <React.Fragment key={doc.documentId}>
          <div>
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
        </React.Fragment>
      ))}
    </>
  )
}
interface Props {
  path?: '/documents-list'
}

const CreateDocument: React.FC<Props> = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)

export default CreateDocument
