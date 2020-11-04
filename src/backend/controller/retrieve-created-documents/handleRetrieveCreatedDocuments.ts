import Axios from 'axios'

import { RedisService } from '../../db-clients/RedisService'
import { FReply, FRequest } from '../../types'
import { retrieveCreatedDocuments } from './retrieveCreatedDocument'

export async function handleRetrieveCreatedDocuments(
  request: FRequest,
  reply: FReply,
) {
  const { creatorId } = request.params
  const { authorization } = request.headers
  const allValidDocuments = await retrieveCreatedDocuments({
    authorization,
    creatorId,
    dbService: RedisService,
    httpClient: Axios,
  })

  reply.send({ documents: allValidDocuments })
}
