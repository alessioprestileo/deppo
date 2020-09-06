import * as crypto from 'crypto'

export class EncryptionService {
  private static key: Buffer
  private static iv: Buffer
  private static initialized: boolean = false

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    /* empty */
  }

  private static initialize = (): void => {
    const envKey = process.env.ENCRYPTION_KEY
    if (!envKey) {
      throw new Error('ERROR IN EncryptionService: NOT CORRECTLY INITIALIZED')
    }

    EncryptionService.key = crypto.createHash('sha256').update(envKey).digest()
    const resizedIV = Buffer.alloc(16)
    const iv = crypto.createHash('sha256').update('myHashedIV').digest()
    iv.copy(resizedIV)
    EncryptionService.iv = resizedIV
  }

  private static ensureInitialized = (): void => {
    if (EncryptionService.initialized) return

    EncryptionService.initialize()
  }

  static decrypt = (encrypted: string): string => {
    EncryptionService.ensureInitialized()
    const cipher = crypto.createDecipheriv(
      'aes256',
      EncryptionService.key,
      EncryptionService.iv,
    )
    const partial = cipher.update(encrypted, 'hex', 'binary')
    const final = partial + cipher.final('binary')

    return final
  }

  static encrypt = (plain: string): string => {
    EncryptionService.ensureInitialized()
    const cipher = crypto.createCipheriv(
      'aes256',
      EncryptionService.key,
      EncryptionService.iv,
    )
    const partial = cipher.update(plain, 'binary', 'hex')
    const final = partial + cipher.final('hex')

    return final
  }
}
