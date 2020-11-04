import { RetrieveDocumentResponse } from '../../shared/types'
import { RedisService } from '../db-clients/RedisService'
import { isCreator } from './isCreator'
import { isSigner } from './isSigner'

type Params = {
  dbService: typeof RedisService
  document: RetrieveDocumentResponse
  userId: string
}

export const isCreatorOrSigner = async (params: Params): Promise<boolean> =>
  isCreator(params) || isSigner(params)
