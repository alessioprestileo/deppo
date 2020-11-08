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
