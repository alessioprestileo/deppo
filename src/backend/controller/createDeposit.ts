import Axios from 'axios'
import { CreateDepositPayload } from '../../shared/types'

// import { RedisService } from '../db-clients/RedisService'
import { FReply, FRequest } from '../types'

export async function createDeposit(request: FRequest, reply: FReply) {
  const { payload } = JSON.parse(request.body)
  const { authorization } = request.headers
  const url = 'https://api.idfy.io/deposit/personal'
  const headers = { Authorization: authorization }
  const body: CreateDepositPayload = payload
  const res = await Axios({
    method: 'POST',
    url,
    headers,
    data: body,
  })
  const { documentId, externalId: externalIdReceived, id } = res.data

  if (externalIdReceived === body.externalId && documentId) {
    console.log({
      externalIdReceived,
      documentId,
      id,
    })
    // await RedisService.addDocumentToCreator(externalIdReceived, documentId)
    // await RedisService.addDocumentToAllTenants(body.tenants, documentId)
    reply.send({ success: true })
  }

  reply.send({ success: false })
}
