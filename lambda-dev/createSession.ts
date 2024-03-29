import fetch from 'node-fetch'

import { FnEvent } from './lib/types'
import { getApiKey } from './lib/utils'

exports.handler = async (event: FnEvent) => {
  const apiKey = getApiKey()
  if (typeof apiKey !== 'string') return apiKey

  const incomingHeaders = event.headers

  try {
    const res = await fetch(`${process.env.DEPPO_BACKEND_URL}/session/create`, {
      method: 'POST',
      headers: {
        authorization: incomingHeaders.authorization,
        'api-key': apiKey,
      },
      body: event.body,
    })
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
