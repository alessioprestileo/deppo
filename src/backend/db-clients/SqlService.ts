import mysql from 'sql-client'

import { Signer } from '../../shared/types'

type ExecutionResponse = { rows: any[]; fields: any[] }
type ConnectionParams = { host: string; user: string; password: string }

export class SqlService {
  private static getConnectionParamsFromUrl = (
    url: string,
  ): ConnectionParams => {
    const split1 = url.split('://')
    const split2 = split1[1].split(':')
    const user = split2[0]
    const split3 = split2[1].split('@')
    const password = split3[0]
    const host = split3[1].split('?')[0]

    return { host, user, password }
  }

  private static connectionParams: ConnectionParams = SqlService.getConnectionParamsFromUrl(
    process.env.CLEARDB_DATABASE_URL as string,
  )

  private constructor() {
    /* empty */
  }

  private static execute = async (
    statement: string,
    vars: string[] = [],
  ): Promise<ExecutionResponse> => {
    const params = SqlService.connectionParams
    const client = new mysql.MySQLClient(params)
    const promise = new Promise<ExecutionResponse>((res) => {
      client.execute(
        statement,
        vars,
        (err: any, rows: any[], fields: any[]) => {
          client.disconnect()
          if (err) {
            throw new Error(`ERROR IN SqlService: ${JSON.stringify(err)}`)
          }

          res({ rows, fields })
        },
      )
    })

    return promise
  }

  private static getTotalDocs = async (
    userId: string,
  ): Promise<ExecutionResponse> => {
    const statement = `coming soon ${userId}`

    return SqlService.execute(statement)
  }

  private static addDocumentToSigner = async (
    signerId: string,
    documentId: string,
  ): Promise<ExecutionResponse> => {
    const statement = `coming soon ${signerId} ${documentId}`

    return SqlService.execute(statement)
  }

  static addDocumentToAllSigners = async (
    signers: Signer[],
    documentId: string,
  ): Promise<ExecutionResponse[]> =>
    Promise.all(
      signers.map(async (item) => {
        const { externalSignerId } = item

        return SqlService.addDocumentToSigner(externalSignerId, documentId)
      }),
    )

  static removeDocumentFromAllSigners = async (
    signers: Signer[],
    documentId: string,
  ): Promise<ExecutionResponse[]> =>
    Promise.all(
      signers.map(async (item) => {
        const { externalSignerId } = item
        return SqlService.removeDocument(externalSignerId, documentId)
      }),
    )

  static addDocumentToCreator = async (
    creatorId: string,
    documentId: string,
  ): Promise<ExecutionResponse> => {
    const statement = `coming soon ${creatorId} ${documentId}`

    return SqlService.execute(statement)
  }

  static removeDocumentFromCreator = async (
    creatorId: string,
    documentId: string,
  ): Promise<ExecutionResponse> =>
    SqlService.removeDocument(creatorId, documentId)

  static removeDocument = async (
    userId: string,
    documentId: string,
  ): Promise<ExecutionResponse> => {
    const statement = `coming soon ${userId} ${documentId}`

    return SqlService.execute(statement)
  }

  static getAllDocuments = async (
    userId: string,
  ): Promise<ExecutionResponse> => {
    const statement = `coming soon ${userId}`

    return SqlService.execute(statement)
  }
}
