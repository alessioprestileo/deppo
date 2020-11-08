import { Signer } from './Signer'

export type DocumentBase = {
  contactDetails: {
    email: string
    url?: string
  }
  dataToSign: {
    title?: string
    description?: string
    base64Content: string
    fileName: string
    convertToPDF?: boolean
  }
  description?: string
  externalId: string
  signers: Signer[]
  title: string
  advanced?: {
    tags?: string[]
    attachments?: number
    requiredSignatures?: number
    getSocialSecurityNumber?: boolean
    timeToLive: {
      deadline: string // example: '2020-03-14T05:49:13Z'
      deleteAfterHours: number
    }
  }
  notification?: {
    reminder?: {
      chronSchedule: string
      maxReminders?: number
    }
    finalReceipt?: {
      includeSignedFile?: true
    }
  }
}
