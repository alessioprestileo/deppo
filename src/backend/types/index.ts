import { FastifyReply, FastifyRequest } from 'fastify'
import { ServerResponse } from 'http'

export type FReply = FastifyReply<ServerResponse>
export type FRequest = FastifyRequest
