import { FReply, FRequest } from '../types'

export const isAuthorizedHook = async (request: FRequest, reply: FReply) => {
  const deppoFrontendApiKey = process.env.DEPPO_FRONTEND_KEY
  if (request.headers['api-key'] !== deppoFrontendApiKey) {
    reply.status(401)
    reply.send({ message: 'You are not authorized to access this resource' })
  }
}
