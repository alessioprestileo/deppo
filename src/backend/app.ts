import * as fastify from 'fastify'
import * as helmet from 'fastify-helmet'
import * as cors from 'fastify-cors'

import { config } from './config'
import { errorHandler } from './middleware/error-handler'
import { notFoundHandler } from './middleware/not-found-handler'
import { logger } from './util/logger'
import { routes } from './routes'
import { checkEnv } from './util/check-env'
import { isAuthorizedHook } from './util/isAuthorizedHook'

export default class App {
  public app: fastify.FastifyInstance
  public port: number

  constructor(port?: number) {
    this.app = fastify()
    this.port = port || config.app.port
    this.setup()
  }

  public setup() {
    this.app.register(helmet)
    this.app.register(cors)
    this.app.addHook('onRequest', isAuthorizedHook)
    this.app.register(routes, { prefix: '/v1' })

    this.app.setErrorHandler(errorHandler)
    this.app.setNotFoundHandler(notFoundHandler)
  }

  /**
   * Handle fatal errors.
   */
  // eslint-disable-next-line class-methods-use-this
  public fatal(err: Error) {
    process.removeAllListeners('uncaughtException')
    process.removeAllListeners('unhandledRejection')
    logger.error('Fatal: ', err.stack)
  }

  // eslint-disable-next-line class-methods-use-this
  public handleUncaughtException(err: Error) {
    process.removeAllListeners('uncaughtException')
    logger.error('UncaughtException: ', err.stack)
  }

  // eslint-disable-next-line class-methods-use-this
  public handleUnhandledRejection(
    reason: Record<string, unknown> | null | undefined,
    promiseIgnored: Promise<any>,
  ): void {
    process.removeAllListeners('unhandledRejection')
    logger.error('UnhandledRejection: ', reason)
  }

  /**
   * Starts the server.
   */
  public async start() {
    // Unexpected termination
    process.once('uncaughtException', this.handleUncaughtException)
    process.once('unhandledRejection', this.handleUnhandledRejection)

    // Expected termination
    process.once('SIGINT', () => this.stop())
    process.once('SIGTERM', () => this.stop())

    checkEnv()

    try {
      this.app.listen(
        this.port,
        '0.0.0.0',
        (err: fastify.FastifyError) => err && this.handleUncaughtException(err),
      )

      logger.info(
        `"${config.app.name}" listening on port ${this.port} on "${config.app.env}" environment`,
      )
    } catch (err) {
      logger.error(err)
    }
  }

  /**
   * Stops the server.
   */
  public stop() {
    if (!this.app) {
      return
    }

    this.app.close()

    process.removeAllListeners('SIGINT')
    process.removeAllListeners('SIGTERM')
  }
}
