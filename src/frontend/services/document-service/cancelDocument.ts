import axios from 'axios'

import { CancelDocumentPayload } from '../../../shared/types'

export type CancelDocumentParams = {
  token: string
  payload: CancelDocumentPayload
}

type CancelDocumentRes = {
  success: boolean
}

export async function cancelDocument({
  token,
  payload,
}: CancelDocumentParams): Promise<CancelDocumentRes> {
  const res = await axios({
    url: '/.netlify/functions/cancelDocument',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: payload,
  })
  const parsed: CancelDocumentRes = res.data

  return parsed
}
