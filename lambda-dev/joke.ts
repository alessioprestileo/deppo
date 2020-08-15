import fetch from 'node-fetch'

const API_ENDPOINT = 'https://icanhazdadjoke.com/'

exports.handler = async () => {
  try {
    const res = await fetch(API_ENDPOINT, {
      headers: { Accept: 'application/json' },
    })
    const resBody = await res.json()

    return {
      statusCode: 200,
      body: JSON.stringify(resBody),
    }
  } catch (error) {
    return { statusCode: 422, body: String(error) }
  }
}
