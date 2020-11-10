import axios from 'axios'

import { CreateDepositPayload } from '../../../shared/types'

export type CreateDocumentParams = {
  token: string
  userId: string
  payload: CreateDepositPayload
}

type CreateDepositRes = {
  success: boolean
}

export async function createDeposit({
  token,
  userId,
  payload,
}: CreateDocumentParams): Promise<CreateDepositRes> {
  const res = await axios({
    url: '/.netlify/functions/createDeposit',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: { userId, payload },
  })
  const parsed: CreateDepositRes = res.data

  return parsed
}
