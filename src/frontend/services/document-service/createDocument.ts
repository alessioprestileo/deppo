import axios from 'axios'

import { CreateDocumentPayload } from '../../../shared/types'

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
  const res = await axios({
    url: '/.netlify/functions/createDocument',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: { userId, payload },
  })
  const parsed: CreateDocumentRes = res.data

  return parsed
}
