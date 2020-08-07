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
