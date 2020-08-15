import { Res500 } from './types'

export function getApiKey(): string | Res500 {
  const apiKey = process.env.DEPPO_BACKEND_API_KEY

  return (
    apiKey || {
      statusCode: 500,
      body: JSON.stringify({ message: 'CANNOT FIND API KEY' }),
    }
  )
}
