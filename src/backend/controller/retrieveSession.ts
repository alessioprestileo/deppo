import Axios from 'axios'

import { FReply, FRequest } from '../types'

export async function retrieveSession(request: FRequest, reply: FReply) {
  const { authorization, 'session-id': RequestId } = request.headers
  if (!RequestId) {
    reply.status(400)
    reply.send({
      message: 'Missing RequestId',
      code: 'BAD_REQUEST',
    })
  }

  const url = `https://api.idfy.io/identification/session?RequestId=${RequestId}`
  const headers = { Authorization: authorization }
  const res = await Axios({
    method: 'GET',
    url,
    headers,
  })
  reply.send(res.data)
}
