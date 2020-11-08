import { RetrieveDocumentResponse } from '../../shared/types'
import { RedisService } from '../db-clients/RedisService'

type Params = {
  dbService: typeof RedisService
  document: RetrieveDocumentResponse
  userId: string
}

export const isCreator = async ({
  dbService,
  document,
  userId,
}: Params): Promise<boolean> => {
  const allIds = await dbService.getAllDocuments(userId)

  return allIds.includes(document.documentId) && userId === document.externalId
}
