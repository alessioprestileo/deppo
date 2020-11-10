import { Mobile } from './Mobile'
import { NotificationsSetupOption } from './NotificationsSetupOption'
import { SignatureMechanism } from './SignatureMechanism'
import { SignatureMethod } from './SignatureMethod'
import { UiColorTheme } from './UiColorTheme'
import { UiLanguage } from './UiLanguage'
import { UiStylingSpinner } from './UiStylingSpinner'

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
    mobile: Mobile
  }
  ui: {
    language?: UiLanguage
    dialogs?: {
      before: {
        useCheckBox: boolean
        title: string
        message: string
      }
    }
    styling?: {
      backgroundColor?: string
      colorTheme?: UiColorTheme
      spinner?: UiStylingSpinner
      themeMode?: 'Default' | 'Light' | 'Dark'
      topBar?: 'Default' | 'Visible' | 'OnlyMenu' | 'Hidden'
    }
  }
  order?: number
  required?: boolean
  getSocialSecurityNumber?: boolean
}
