import * as throng from 'throng'

import App from './app'
import { config } from './config'
import { logger } from './util/logger'

/**
 * Start a worker process.
 */
function start(id: number) {
  const app = new App()
  app.start().catch(app.fatal)
  logger.info(`Started worker ${id}`)
}

/**
 * Start the master process.
 */
function master() {
  logger.info('Master process started')
}

throng({
  workers: config.app.concurrency,
  grace: config.app.port,
  master,
  start,
})
