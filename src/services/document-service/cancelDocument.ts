import { CancelDocumentPayload } from './types'

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
  const body = JSON.stringify(payload)

  const res = await fetch('/.netlify/functions/cancelDocument', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  const parsed: CancelDocumentRes = await res.json()

  return parsed
}
