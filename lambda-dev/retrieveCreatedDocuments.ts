import fetch from 'node-fetch'

import { getApiKey, extractEncryptedUserId } from './lib/utils'
import { FnEvent } from './lib/types'

exports.handler = async (event: FnEvent) => {
  const apiKey = getApiKey()
  if (typeof apiKey !== 'string') return apiKey

  const bodyParsed: { userId: string } = JSON.parse(event.body)
  const encryptedUserId = extractEncryptedUserId(bodyParsed)

  try {
    const res = await fetch(
      `${process.env.DEPPO_BACKEND_URL}/documents/created/${encryptedUserId}`,
      {
        method: 'GET',
        headers: { ...event.headers, 'api-key': apiKey },
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
