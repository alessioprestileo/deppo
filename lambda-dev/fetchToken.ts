import fetch from 'node-fetch'

import { getApiKey } from './lib/utils'

exports.handler = async () => {
  const apiKey = getApiKey()
  if (typeof apiKey !== 'string') return apiKey

  try {
    const res = await fetch(`${process.env.DEPPO_BACKEND_URL}/token`, {
      method: 'GET',
      headers: { 'api-key': apiKey },
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
