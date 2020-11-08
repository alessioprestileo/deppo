import Axios, { AxiosResponse } from 'axios'

import { RetrieveDocumentResponse } from '../../../shared/types'
import { RedisService } from '../../db-clients/RedisService'
import { isCreatorOrSigner } from '../../util/isCreatorOrSigner'

type RetrieveDocumentParamsBase = {
  authorization: string
  documentId: string
  dbService: typeof RedisService
  httpClient: typeof Axios
}

type RetrieveDocumentByCreatorParams = RetrieveDocumentParamsBase & {
  creatorId: string
}
type RetrieveDocumentBySignerParams = RetrieveDocumentParamsBase & {
  signerId: string
}

type RetrieveDocumentParams =
  | RetrieveDocumentByCreatorParams
  | RetrieveDocumentBySignerParams

export async function retrieveDocument({
  authorization,
  dbService,
  documentId,
  httpClient,
  ...otherParams
}: RetrieveDocumentParams): Promise<RetrieveDocumentResponse | undefined> {
  const baseUrl = 'https://api.idfy.io/signature/documents'
  const headers = { Authorization: authorization }
  const { creatorId } = otherParams as { creatorId: string }
  const { signerId } = otherParams as { signerId: string }
  const userId = creatorId || signerId
  const response: AxiosResponse<RetrieveDocumentResponse> = await httpClient({
    method: 'GET',
    url: `${baseUrl}/${documentId}`,
    headers,
  })
  const userIsCreatorOrSigner = await isCreatorOrSigner({
    dbService,
    document: response.data,
    userId,
  })

  if (!userIsCreatorOrSigner) {
    return
  }

  return response.data
}
