import { Dictionary } from './Dictionary'
import { DocumentBase } from './DocumentBase'
import { Package } from './Package'

export type RetrieveDocumentPayload = DocumentBase & {
  documentId: string
  status: {
    documentStatus:
      | 'unsigned'
      | 'waiting_for_attachments'
      | 'partialsigned'
      | 'signed'
      | 'canceled'
      | 'expired'
    completedPackages: Package[]
    attachmentPackages: Dictionary<Package>
  }
}
