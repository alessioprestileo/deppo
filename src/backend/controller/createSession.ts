import { v4 as uuidV4 } from 'uuid'
import Axios from 'axios'

import { FReply, FRequest } from '../types'

export async function createSession(request: FRequest, reply: FReply) {
  const { destination } = JSON.parse(request.body)
  const { authorization } = request.headers
  const url = 'https://api.idfy.io/identification/session'
  const headers = { Authorization: authorization }
  const body = {
    IdentityProvider: 'NO_BANKID_WEB',
    ReturnUrls: {
      Error: `${process.env.DEPPO_FRONTEND_URL}/protected/login-redirect?error=true`,
      Abort: `${process.env.DEPPO_FRONTEND_URL}/protected/login-redirect?abort=true`,
      Success: `${process.env.DEPPO_FRONTEND_URL}/protected/login-redirect?destination=${destination}`,
    },
    Language: 'NO',
    GetSocialSecurityNumber: true,
    ExternalReference: uuidV4(),
    Addonservices: {
      'no.personal.info': '',
    },
  }
  const res = await Axios({
    method: 'POST',
    url,
    headers,
    data: body,
  })
  reply.send(res.data)
}
