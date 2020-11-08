import Axios from 'axios'

import { FReply, FRequest } from '../types'

export async function retrieveSessionStatus(request: FRequest, reply: FReply) {
  const { authorization, sessionId } = request.headers
  if (!sessionId) {
    reply.status(400)
    reply.send({
      message: 'Missing sessionId',
      code: 'BAD_REQUEST',
    })
  }

  const url = `https://api.idfy.io/identification/session/status?sessionId=${sessionId}`
  const headers = { Authorization: authorization }
  const res = await Axios({
    method: 'GET',
    url,
    headers,
  })
  reply.send(res.data)
}
