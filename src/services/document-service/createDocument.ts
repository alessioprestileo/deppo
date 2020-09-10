import { CreateDocumentPayload } from './types'

export type CreateDocumentParams = {
  token: string
  userId: string
  payload: CreateDocumentPayload
}

type CreateDocumentRes = {
  success: boolean
}

export async function createDocument({
  token,
  userId,
  payload,
}: CreateDocumentParams): Promise<CreateDocumentRes> {
  const body = JSON.stringify({ userId, payload })

  const res = await fetch('/.netlify/functions/createDocument', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  const parsed: CreateDocumentRes = await res.json()

  return parsed
}
