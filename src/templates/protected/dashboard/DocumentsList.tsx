import React, { useState, useEffect } from 'react'

import { AuthConsumer, AuthService } from '../../../services/authentication'
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
    const { documents } = await res.data
    setCreatedDocuments(documents)
  }

  return { fetchCreatedDocuments, createdDocuments }
}

export const Content: React.FC<ContentProps> = ({ authService }) => {
  const { session, tokenInfo } = authService
  const token = tokenInfo?.token
  const { fetchCreatedDocuments, createdDocuments } = useFetchCreatedDocuments()

  useEffect(() => {
    if (token && session) {
      const userId = session.SocialSecurityNumber
      fetchCreatedDocuments(token, userId)
    }
  }, [token, session])

  if (!session || !token) {
    throw new Error('ERROR WHILE RENDERING DocumentsList COMPONENT')
  }

  const userId = session.SocialSecurityNumber
  const handleRefreshList = () => {
    fetchCreatedDocuments(token, userId)
  }

  return (
    <>
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

export const DocumentsList: React.FC = () => (
  <AuthConsumer>
    {(authService) => <Content authService={authService} />}
  </AuthConsumer>
)
