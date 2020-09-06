import { CreateDocumentPayload } from './types'

export type CreateDocumentParams = {
  token: string
  userId: string
  payload: CreateDocumentPayload
}

export async function createDocument({
  token,
  userId,
  payload,
}: CreateDocumentParams): Promise<Response> {
  const body = JSON.stringify({ userId, payload })

  return fetch('/.netlify/functions/createDocument', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
}
