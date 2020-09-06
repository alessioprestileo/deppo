import { EncryptionService } from './EncryptionService'
import { Res500, CreateDocumentPayload } from './types'

export function getApiKey(): string | Res500 {
  const apiKey = process.env.DEPPO_BACKEND_API_KEY

  return (
    apiKey || {
      statusCode: 500,
      body: JSON.stringify({ message: 'CANNOT FIND API KEY' }),
    }
  )
}

export function extractEncryptedUserId({ userId }: { userId: string }): string {
  return EncryptionService.encrypt(userId)
}

export function assignSignersIds(
  payload: CreateDocumentPayload,
): CreateDocumentPayload {
  payload.signers.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.externalSignerId = EncryptionService.encrypt(item.signerInfo.email)
  })

  return payload
}
