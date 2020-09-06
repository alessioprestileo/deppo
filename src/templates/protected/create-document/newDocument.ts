import { CreateDocumentPayload } from 'services/document-service'

export const newDocument: CreateDocumentPayload = {
  title: 'Test document',
  signers: [
    {
      externalSignerId: '',
      redirectSettings: {
        redirectMode: 'donot_redirect',
      },
      signatureType: {
        mechanism: 'pkisignature',
      },
      ui: {
        language: 'EN',
        dialogs: {
          before: {
            useCheckBox: false,
            title: 'Info',
            message:
              'Please read the contract on the next pages carefully. Pay some extra attention to paragraph 5.',
          },
        },
        styling: {
          colorTheme: 'Pink',
          spinner: 'Cubes',
        },
      },
      order: 0,
      required: false,
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
    convertToPDF: false,
  },
  contactDetails: {
    email: 'test@test.com',
    url: 'https://idfy.io',
  },
  externalId: '',
  description: 'This is an important document',
}
