import Axios from 'axios'
import { FReply, FRequest } from '../types'

export async function invalidateSession(request: FRequest, reply: FReply) {
  const { RequestId } = JSON.parse(request.body)
  const { authorization } = request.headers
  if (!RequestId) {
    reply.status(400)
    reply.send({
      message: 'Missing RequestId',
      code: 'BAD_REQUEST',
    })
  }

  const url = 'https://api.idfy.io/identification/session/invalidate'
  const headers = { Authorization: authorization }
  const body = { RequestId }
  await Axios({
    method: 'PUT',
    url,
    headers,
    data: body,
  })

  reply.send({ message: 'Session successfully invalidated', RequestId })
}
