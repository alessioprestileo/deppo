export type RetrieveAllDocumentsParams = {
  token: string
  userId: string
}

export async function retrieveCreatedDocuments({
  token,
  userId,
}: RetrieveAllDocumentsParams): Promise<Response> {
  const body = JSON.stringify({ userId })

  return fetch('/.netlify/functions/retrieveCreatedDocuments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
}
