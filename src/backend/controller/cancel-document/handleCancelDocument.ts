import Axios from 'axios'

import { RedisService } from '../../db-clients/RedisService'
import { FReply, FRequest } from '../../types'
import { cancelDocument } from './cancelDocument'

export async function handleCancelDocument(request: FRequest, reply: FReply) {
  const { creatorId, documentId, reason } = JSON.parse(request.body)
  const { authorization } = request.headers
  const canceledId = await cancelDocument({
    authorization,
    creatorId,
    dbService: RedisService,
    documentId,
    httpClient: Axios,
    reason,
  })

  if (!canceledId) {
    reply.status(403)
    reply.send({ message: 'YOU ARE NOT AUTHORIZED TO CANCEL THIS DOCUMENT' })
  }

  reply.send({ success: true })
}
