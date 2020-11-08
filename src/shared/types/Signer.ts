import { NotificationsSetupOption } from './NotificationsSetupOption'
import { SignatureMechanism } from './SignatureMechanism'
import { SignatureMethod } from './SignatureMethod'

export type Signer = {
  externalSignerId: string
  authentication: {
    mechanism: 'off' | 'eid' | 'smsOtp' | 'eidAndSmsOtp'
    socialSecurityNumber?: string
  }
  notifications: {
    setup: {
      request: NotificationsSetupOption
      reminder: NotificationsSetupOption
      signatureReceipt: NotificationsSetupOption
      finalReceipt: NotificationsSetupOption
      canceled: NotificationsSetupOption
      expired: NotificationsSetupOption
    }
  }
  redirectSettings: {
    redirectMode:
      | 'donot_redirect'
      | 'redirect'
      | 'iframe_with_webmessaging'
      | 'iframe_with_redirect'
      | 'iframe_with_redirect_and_webmessaging'
  }
  signatureType: {
    mechanism: SignatureMechanism
    signatureMethods: SignatureMethod[]
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
