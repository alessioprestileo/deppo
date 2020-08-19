export type TokenInfo = {
  token: string
  tokenExpires: number
}

export type TokenResponse = {
  // eslint-disable-next-line camelcase
  access_token: string
  // eslint-disable-next-line camelcase
  expires_in: number
}

export type SessionCreateResponse = {
  RequestId: string
  Url: string
}

export type SessionFetchResponse = {
  Name: string
  FirstName: string
  MiddleName: string
  LastName: string
  DateOfBirth: string
  Status: string
  SocialSecurityNumber: string
  IdentityProviderUniqueId: string
  IdentityProvider: string
  EnvironmentInfo: {
    UserAgent: string
    IPAddress: string
  }
  MetaData: {
    'no.personal.info': string
  }
  RequestId: string
}
