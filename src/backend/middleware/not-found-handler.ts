import { FReply, FRequest } from '../types'
import { NotFoundError } from '../util/error'

export async function notFoundHandler(request: FRequest, reply: FReply) {
  const error = new NotFoundError()

  reply.status(404)
  reply.send({
    code: error.code,
    message: error.message,
  })
}
