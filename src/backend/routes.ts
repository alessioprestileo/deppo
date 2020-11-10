import { FastifyInstance } from 'fastify'

import {
  status,
  token,
  createSession,
  retrieveSession,
  retrieveSessionStatus,
  invalidateSession,
  bankIdMobile,
  createDocument,
  handleRetrieveCreatedDocuments,
  retrieveDocumentsToSign,
  handleRetrieveDocument,
  handleCancelDocument,
  createDeposit,
} from './controller'

export const routes = (app: FastifyInstance, _opts: any, done: () => void) => {
  app.route({
    method: 'GET',
    url: '/',
    handler: status,
  })
  app.route({
    method: 'GET',
    url: '/token',
    handler: token,
  })
  app.route({
    method: 'POST',
    url: '/session/create',
    handler: createSession,
  })
  app.route({
    method: 'GET',
    url: '/session/retrieve',
    handler: retrieveSession,
  })
  app.route({
    method: 'GET',
    url: '/session/retrieve-status',
    handler: retrieveSessionStatus,
  })
  app.route({
    method: 'PUT',
    url: '/session/invalidate',
    handler: invalidateSession,
  })
  app.route({
    method: 'POST',
    url: '/bankid-mobile',
    handler: bankIdMobile,
  })
  app.route({
    method: 'POST',
    url: '/documents/create',
    handler: createDocument,
  })
  app.route({
    method: 'GET',
    url: '/documents/:documentId',
    handler: handleRetrieveDocument,
  })
  app.route({
    method: 'GET',
    url: '/documents/created/:creatorId',
    handler: handleRetrieveCreatedDocuments,
  })
  app.route({
    method: 'GET',
    url: '/documents/to-sign/:signerId',
    handler: retrieveDocumentsToSign,
  })
  app.route({
    method: 'POST',
    url: '/documents/cancel',
    handler: handleCancelDocument,
  })
  app.route({
    method: 'POST',
    url: '/deposits/create',
    handler: createDeposit,
  })

  done()
}
