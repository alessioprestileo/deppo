import Axios, { AxiosResponse } from 'axios'

import { RetrieveDocumentResponse } from '../../../shared/types'
import { RedisService } from '../../db-clients/RedisService'

type RetrieveCreatedDocumentParams = {
  authorization: string
  creatorId: string
  dbService: typeof RedisService
  httpClient: typeof Axios
}

export async function retrieveCreatedDocuments({
  authorization,
  creatorId,
  dbService,
  httpClient,
}: RetrieveCreatedDocumentParams): Promise<RetrieveDocumentResponse[]> {
  const baseUrl = 'https://api.idfy.io/signature/documents'
  const headers = { Authorization: authorization }
  const allIds = await dbService.getAllDocuments(creatorId)
  const allResponses: AxiosResponse<
    RetrieveDocumentResponse
  >[] = await Promise.all(
    allIds.map((item) =>
      httpClient({
        method: 'GET',
        url: `${baseUrl}/${item}`,
        headers,
      }),
    ),
  )
  const allValidDocuments = allResponses
    .map((item) => item.data)
    .filter((item) => item.externalId === creatorId)

  return allValidDocuments
}
