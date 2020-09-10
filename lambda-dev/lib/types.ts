export type Dictionary<T = any> = Record<string, T | undefined>

type HttpMethod =
  | 'DELETE'
  | 'GET'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'delete'
  | 'get'
  | 'patch'
  | 'post'
  | 'put'

export type FnEvent = {
  path: string
  httpMethod: HttpMethod
  headers: Dictionary
  queryStringParameters: Dictionary
  body: string
  isBase64Encoded: boolean
}

export type Res500 = {
  statusCode: 500
  body: string
}

export type Signer = {
  externalSignerId: string
  redirectSettings: {
    redirectMode:
      | 'donot_redirect'
      | 'redirect'
      | 'iframe_with_webmessaging'
      | 'iframe_with_redirect'
      | 'iframe_with_redirect_and_webmessaging'
  }
  signatureType: {
    mechanism:
      | 'pkisignature'
      | 'identification'
      | 'handwritten'
      | 'handwritten_with_identification'
    signatureMethods?:
      | 'no_bankid_mobile'
      | 'no_bankid_netcentric'
      | 'no_buypass'
      | 'se_bankid'
      | 'dk_nemid'
      | 'fi_tupas'
      | 'fi_mobiilivarmenne'
      | 'fi_eid'
      | 'sms_otp'
      | 'unknown'
  }
  signerInfo: {
    email: string
    mobile: {
      countryCode: string
      number: string
    }
  }
  ui: {
    language?: 'EN' | 'NO' | 'DA' | 'SV' | 'FI'
    dialogs?: {
      before: {
        useCheckBox: boolean
        title: string
        message: string
      }
    }
    styling?: {
      backgroundColor?: string
      colorTheme?:
        | 'Default'
        | 'Black'
        | 'Blue'
        | 'Cyan'
        | 'Dark'
        | 'Lime'
        | 'Neutral'
        | 'Pink'
        | 'Purple'
        | 'Red'
        | 'Teal'
        | 'Indigo'
        | 'LightBlue'
        | 'DeepPurple'
        | 'Green'
        | 'LightGreen'
        | 'Yellow'
        | 'Amber'
        | 'Orange'
        | 'DeepOrange'
        | 'Brown'
        | 'Gray'
        | 'BlueGray'
        | 'OceanGreen'
        | 'GreenOcean'
      spinner?: 'Document' | 'Classic' | 'Cubes' | 'Bounce'
      themeMode?: 'Default' | 'Light' | 'Dark'
      topBar?: 'Default' | 'Visible' | 'OnlyMenu' | 'Hidden'
    }
  }
  order?: number
  required?: boolean
  getSocialSecurityNumber?: boolean
}

type DocumentBase = {
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
}

export type CreateDocumentPayload = DocumentBase

export type CancelDocumentPayload = {
  documentId: string
  creatorId: string
  reason: string
}

export type Package =
  | 'unsigned'
  | 'native'
  | 'standard_packaging'
  | 'pades'
  | 'xades'

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
