import { Mobile } from './Mobile'
import { UiColorTheme } from './UiColorTheme'
import { UiStylingSpinner } from './UiStylingSpinner'

type Country = 'NO' | 'IT' | 'SE' | 'US' // ^[A-Z]{2}$

type Language = 'EN' | 'NO' | 'DA' | 'SV' | 'FI'

type DepositUi = {
  language?: Language
  styling?: {
    colorTheme?: UiColorTheme
    themeMode?: 'Light' | 'Dark'
    spinner?: UiStylingSpinner
    backgroundColor?: string // use hexadecimal value
  }
}

type Address = {
  city: string
  country: Country
  postalCode: string
  street: string
}

type TenantInfo = {
  address: Address
  firstName: string
  lastName: string
  mobile: Mobile
  email: string
  nationality: Country
}

type Flow = 'redirect' | 'iframe'

type IFrameSettings = {
  postMessageTargetOrigin: string
  parentDomains: string
}

type RedirectSettings = {
  error: string
  cancel: string
  success: string
}

type Tenant = {
  aml?: boolean
  externalId: string
  info: TenantInfo
  ui?: DepositUi
  flow: Flow
  iframeSettings?: IFrameSettings // required for iframe flow
  redirectSettings?: RedirectSettings // required for redirect flow
}

export type CreateDepositPayload = {
  tenants: Tenant[]
  landlord: {
    name: string
    organizationNumber?: string // Either this or ssn must be set
    address: Address
    ssn?: string // Either this or organizationNumber must be set
    nationality: Country
    representativeSignature?: {
      ui?: DepositUi
      flow: Flow
      iframeSettings?: IFrameSettings // required for iframe flow
      redirectSettings?: RedirectSettings // required for redirect flow
    }
  }
  externalId: string
  contract: {
    dataToSign: {
      rentContractPDF: string // Base64-encoded string of the document, UTF-8-encoded
    }
    monthlyRent?: number
    depositFactor?: number
    depositAmount?: number // If this is specified monthlyRent and depositFactor will be ignored
    paymentDeadline?: string // example: '2020-03-14T05:49:13Z'
    from?: string // example: '2020-03-14T05:49:13Z'
    to?: string // example: '2020-03-14T05:49:13Z'
  }
  rentObject: {
    address: string
    address2?: string
    city: string
    country: Country
    postalCode: string
  }
  contactDetails: {
    name?: string
    phone?: string
    email: string
    url?: string
  }
  advanced?: {
    tags?: string[]
  }
}
