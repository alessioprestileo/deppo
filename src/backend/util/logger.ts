import * as pino from 'pino'

import { config } from '../config'

export const logger = pino(config.logging)