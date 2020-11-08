import { pick } from 'lodash'
import { v4 as uuidV4 } from 'uuid'

import { FReply, FRequest } from '../types'
import { HttpError } from '../util/error'
import { logger } from '../util/logger'

/* istanbul ignore next */
export async function errorHandler(
  error: Error,
  request: FRequest,
  reply: FReply,
) {
  // Known error
  if (error instanceof HttpError) {
    reply.status(error.status)
    reply.send({
      message: error.message,
      code: error.code,
    })
  } else {
    // Unknown error
    logger.error(
      {
        transactionId: uuidV4(),
        ...pick(request, ['body', 'headers', 'method', 'url']),
      },
      `Unandled error: ${error.message}\nStack: ${error.stack}`,
    )

    reply.status(500)
    reply.send({
      message: 'Internal Server Error',
      code: 'E_SERVER',
    })
  }
}
