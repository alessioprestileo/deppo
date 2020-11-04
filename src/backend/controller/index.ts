import { FReply, FRequest } from '../types'

export { token } from './token'
export { createSession } from './createSession'
export { retrieveSession } from './retrieveSession'
export { retrieveSessionStatus } from './retrieveSessionStatus'
export { invalidateSession } from './invalidateSession'
export { bankIdMobile } from './bankIdMobile'
export { createDocument } from './createDocument'
export { handleRetrieveCreatedDocuments } from './retrieve-created-documents/handleRetrieveCreatedDocuments'
export { retrieveDocumentsToSign } from './retrieveDocumentsToSign'
export { handleRetrieveDocument } from './retieve-document/handleRetrieveDocument'
export { handleCancelDocument } from './cancel-document/handleCancelDocument'

export async function status(request: FRequest, reply: FReply) {
  reply.send({ version: '0.0.1' })
}
