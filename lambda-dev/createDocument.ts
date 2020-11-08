import fetch from 'node-fetch'

import { CreateDocumentPayload } from '../src/shared/types'
import { FnEvent } from './lib/types'
import {
  getApiKey,
  extractEncryptedUserId,
  assignSignersIds,
} from './lib/utils'

exports.handler = async (event: FnEvent) => {
  const apiKey = getApiKey()
  if (typeof apiKey !== 'string') return apiKey

  const bodyParsed: {
    userId: string
    payload: CreateDocumentPayload
  } = JSON.parse(event.body)
  const { payload } = bodyParsed
  const encryptedUserId = extractEncryptedUserId(bodyParsed)
  payload.externalId = encryptedUserId
  assignSignersIds(payload)
  const body = JSON.stringify({ payload })
  const incomingHeaders = event.headers

  try {
    const res = await fetch(
      `${process.env.DEPPO_BACKEND_URL}/documents/create`,
      {
        method: 'POST',
        headers: {
          authorization: incomingHeaders.authorization,
          'api-key': apiKey,
        },
        body,
      },
    )
    const resBody = await res.json()

    return {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      statusCode: res.status,
      body: JSON.stringify(resBody),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    }
  }
}
