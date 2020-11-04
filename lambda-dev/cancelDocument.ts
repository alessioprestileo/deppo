import fetch from 'node-fetch'

import { CancelDocumentPayload } from '../src/shared/types'
import { FnEvent } from './lib/types'
import { getApiKey, extractEncryptedUserId } from './lib/utils'

exports.handler = async (event: FnEvent) => {
  const apiKey = getApiKey()
  if (typeof apiKey !== 'string') return apiKey

  const { creatorId, documentId, reason } = JSON.parse(
    event.body,
  ) as CancelDocumentPayload
  const encryptedUserId = extractEncryptedUserId({ userId: creatorId })
  const body = JSON.stringify({
    creatorId: encryptedUserId,
    documentId,
    reason,
  } as CancelDocumentPayload)
  const incomingHeaders = event.headers

  try {
    const res = await fetch(
      `${process.env.DEPPO_BACKEND_URL}/documents/cancel`,
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
