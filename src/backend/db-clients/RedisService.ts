import * as redis from 'redis'

import { Signer } from '../../shared/types'

export class RedisService {
  private static _instance?: redis.RedisClient
  private static redisUrl: string = process.env.REDIS_URL as string

  private constructor() {
    /* empty */
  }

  private static getDbInstance(): redis.RedisClient {
    if (RedisService._instance) return RedisService._instance

    return RedisService.initialize()
  }

  private static initialize = (): redis.RedisClient => {
    RedisService._instance = redis.createClient(RedisService.redisUrl)
    RedisService._instance.on('error', (error) => {
      throw new Error(`ERROR IN RedisService: ${JSON.stringify(error)}`)
    })

    return RedisService._instance
  }

  private static getTotalDocs = async (id: string): Promise<number> => {
    const dbInstance = RedisService.getDbInstance()
    if (!dbInstance.exists(id)) return 0

    return new Promise((resolve, reject) => {
      dbInstance.zcard(id, (err, reply) => {
        if (err) {
          reject(err)
          return
        }
        resolve(reply)
      })
    })
  }

  private static addDocumentToSigner = async (
    signerId: string,
    documentId: string,
  ): Promise<number> => {
    const dbInstance = RedisService.getDbInstance()
    const score = (await RedisService.getTotalDocs(signerId)) + 1

    return new Promise((resolve, reject) => {
      dbInstance.zadd(signerId, score, documentId, (err, reply) => {
        if (err) {
          reject(err)
          return
        }
        resolve(reply)
      })
    })
  }

  static addDocumentToAllSigners = async (
    signers: Signer[],
    documentId: string,
  ): Promise<number[]> =>
    Promise.all(
      signers.map(async (item) => {
        const { externalSignerId } = item
        return RedisService.addDocumentToSigner(externalSignerId, documentId)
      }),
    )

  static removeDocumentFromAllSigners = async (
    signers: Signer[],
    documentId: string,
  ): Promise<number[]> =>
    Promise.all(
      signers.map(async (item) => {
        const { externalSignerId } = item
        return RedisService.removeDocument(externalSignerId, documentId)
      }),
    )

  static addDocumentToCreator = async (
    creatorId: string,
    documentId: string,
  ): Promise<number> => {
    const dbInstance = RedisService.getDbInstance()
    const score = (await RedisService.getTotalDocs(creatorId)) + 1

    return new Promise((resolve, reject) => {
      dbInstance.zadd(creatorId, score, documentId, (err, reply) => {
        if (err) {
          reject(err)
          return
        }
        resolve(reply)
      })
    })
  }

  static removeDocumentFromCreator = async (
    creatorId: string,
    documentId: string,
  ): Promise<number> => RedisService.removeDocument(creatorId, documentId)

  static removeDocument = async (
    userid: string,
    documentId: string,
  ): Promise<number> =>
    new Promise((resolve, reject) => {
      RedisService.getDbInstance().zrem(userid, documentId, (err, reply) => {
        if (err) {
          reject(err)
          return
        }
        resolve(reply)
      })
    })

  static getAllDocuments = async (userid: string): Promise<string[]> =>
    new Promise((resolve, reject) => {
      RedisService.getDbInstance().zrange(userid, 0, -1, (err, reply) => {
        if (err) {
          reject(err)
          return
        }
        resolve(reply)
      })
    })
}
