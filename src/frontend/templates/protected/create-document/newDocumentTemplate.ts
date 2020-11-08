import { CreateDocumentPayload } from '../../../../shared/types'

export const newDocumentTemplate: CreateDocumentPayload = {
  title: 'Please sign this document',
  signers: [
    {
      externalSignerId: '',
      authentication: {
        mechanism: 'eid',
        socialSecurityNumber: '09026233906',
      },
      notifications: {
        setup: {
          request: 'sendEmail',
          reminder: 'sendEmail',
          signatureReceipt: 'sendEmail',
          finalReceipt: 'sendEmail',
          canceled: 'sendEmail',
          expired: 'sendEmail',
        },
      },
      redirectSettings: {
        redirectMode: 'donot_redirect',
      },
      signatureType: {
        mechanism: 'pkisignature',
        signatureMethods: ['no_bankid_netcentric'],
      },
      ui: {
        language: 'EN',
        dialogs: {
          before: {
            useCheckBox: false,
            title: 'Info',
            message:
              'Please read the contract on the next pages carefully. Cheers by Deppo.',
          },
        },
        styling: {
          colorTheme: 'Neutral',
          spinner: 'Cubes',
        },
      },
      order: 0,
      required: true,
      getSocialSecurityNumber: false,
      signerInfo: {
        email: 'alessioprestileo@gmail.com',
        mobile: {
          countryCode: '+47',
          number: '95410926',
        },
      },
    },
  ],
  dataToSign: {
    title: 'Document title',
    description: 'Document description',
    base64Content: 'VGhpcyB0ZXh0IGNhbiBzYWZlbHkgYmUgc2lnbmVk',
    fileName: 'sample.txt',
    convertToPDF: true,
  },
  contactDetails: {
    email: 'test@test.com',
    url: 'https://idfy.io',
  },
  externalId: '',
  description: 'Signature request powered by Deppo',
  notification: {
    reminder: {
      chronSchedule: '0 0 0 ? * * *',
      maxReminders: 3,
    },
    finalReceipt: {
      includeSignedFile: true,
    },
  },
}
