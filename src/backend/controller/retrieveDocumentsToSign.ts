import Axios from 'axios'

import { RetrieveDocumentResponse } from '../../shared/types'
import { RedisService } from '../db-clients/RedisService'
import { FReply, FRequest } from '../types'

export async function retrieveDocumentsToSign(
  request: FRequest,
  reply: FReply,
) {
  const { signerId } = request.params
  const { authorization } = request.headers
  const baseUrl = 'https://api.idfy.io/signature/documents'
  const headers = { Authorization: authorization }
  const allIds = await RedisService.getAllDocuments(signerId)
  const allResponses = await Promise.all(
    allIds.map((item) =>
      Axios({
        method: 'GET',
        url: `${baseUrl}/${item}`,
        headers,
      }),
    ),
  )
  const allValidDocuments = allResponses
    .map((item) => item.data)
    .filter((item: RetrieveDocumentResponse) =>
      item.signers.some((signer) => signer.externalSignerId === signerId),
    )

  reply.send({ documents: allValidDocuments })
}
