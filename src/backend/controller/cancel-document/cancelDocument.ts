import Axios from 'axios'

import { isCreator } from '../../util/isCreator'
import { RedisService } from '../../db-clients/RedisService'
import { retrieveDocument } from '../retieve-document/retrieveDocument'

type CancelDocumentParams = {
  authorization: string
  creatorId: string
  documentId: string
  dbService: typeof RedisService
  httpClient: typeof Axios
  reason: string
}

export async function cancelDocument({
  authorization,
  creatorId,
  dbService,
  documentId,
  httpClient,
  reason,
}: CancelDocumentParams): Promise<string | undefined> {
  const document = await retrieveDocument({
    authorization,
    creatorId,
    dbService,
    documentId,
    httpClient,
  })
  if (!document) return

  const userIsCreator = await isCreator({
    dbService,
    document,
    userId: creatorId,
  })

  if (!userIsCreator) return

  const url = `https://api.idfy.io/signature/documents/${documentId}/cancel?reason=${encodeURIComponent(
    reason,
  )}`
  const headers = { Authorization: authorization }
  const res = await httpClient({
    method: 'POST',
    url,
    headers,
  })

  if (res.status !== 200) return

  await dbService.removeDocumentFromCreator(creatorId, documentId)
  await dbService.removeDocumentFromAllSigners(document.signers, documentId)

  return documentId
}
