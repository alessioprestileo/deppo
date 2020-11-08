import Axios from 'axios'
import { CreateDocumentPayload } from '../../shared/types'

import { RedisService } from '../db-clients/RedisService'
import { FReply, FRequest } from '../types'

export async function createDocument(request: FRequest, reply: FReply) {
  const { payload } = JSON.parse(request.body)
  const { authorization } = request.headers
  const url = 'https://api.idfy.io/signature/documents'
  const headers = { Authorization: authorization }
  const body: CreateDocumentPayload = payload
  const res = await Axios({
    method: 'POST',
    url,
    headers,
    data: body,
  })
  const { documentId, externalId: externalIdReceived } = res.data

  if (externalIdReceived === body.externalId && documentId) {
    await RedisService.addDocumentToCreator(externalIdReceived, documentId)
    await RedisService.addDocumentToAllSigners(body.signers, documentId)
    reply.send({ success: true })
  }

  reply.send({ success: false })
}
