import Axios from 'axios'
import { stringify } from 'querystring'

import { FReply, FRequest } from '../types'

export async function token(request: FRequest, reply: FReply) {
  const clientId = process.env.SIGNICAT_CLIENT_ID
  const clientSecret = process.env.SIGNICAT_CLIENT_SECRET
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  )
  const scopes =
    'account_read identify document_read document_write document_file event'
  const url = 'https://api.idfy.io/oauth/connect/token'
  const body = {
    grant_type: 'client_credentials',
    scope: scopes,
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${credentials}`,
  }
  const res = await Axios({
    method: 'POST',
    url,
    headers,
    data: stringify(body),
  })
  reply.send(res.data)
}
