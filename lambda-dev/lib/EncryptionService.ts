import * as crypto from 'crypto'

export class EncryptionService {
  private static key: Buffer
  private static iv: Buffer

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    /* empty */
  }

  static initialize = (): void => {
    const envKey = process.env.ENCRYPTION_KEY
    if (!envKey) {
      throw new Error('ERROR IN EncryptionService: NOT CORRECTLY INITIALIZED')
    }

    EncryptionService.key = crypto.createHash('sha256').update(envKey).digest()
    const resizedIV = Buffer.allocUnsafe(16)
    const iv = crypto.createHash('sha256').update('myHashedIV').digest()
    iv.copy(resizedIV)
    EncryptionService.iv = resizedIV
  }

  static decrypt = (encrypted: string): string => {
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
