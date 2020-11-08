import Axios from 'axios'

import { RedisService } from '../../db-clients/RedisService'
import { FReply, FRequest } from '../../types'
import { retrieveDocument } from './retrieveDocument'

export async function handleRetrieveDocument(request: FRequest, reply: FReply) {
  const { creatorId, signerId } = JSON.parse(request.body)
  const { documentId } = request.params
  const { authorization } = request.headers
  const document = await retrieveDocument({
    authorization,
    creatorId,
    documentId,
    dbService: RedisService,
    httpClient: Axios,
    signerId,
  })

  if (!document) {
    reply.status(403)
    reply.send({ message: 'YOU ARE NOT AUTHORIZED TO ACCESS THIS DOCUMENT' })
  }

  reply.send({ document })
}
