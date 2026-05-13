import { ResponseErrors } from '@core/error/constants'
import createLogger from '@core/utils/logger'
import { appConfig } from '@core/config/app'

import type { SendErrorParams } from '@core/error/types'

const logger = createLogger('error-handler')

const sendError = ({ code, res, error, details, local }: SendErrorParams): string => {
  try {
    const localMessage = local ? `[${local}] ` : ''
    const responseError = ResponseErrors[code]

    if (appConfig.logError.message) {
      logger.error(`${localMessage}${responseError.message}`)
    }

    if (error && appConfig.logError.data) {
      logger.error('Error details:', error)
    }

    if (res.headersSent) return 'error'

    const payload = details ? { ...responseError, details } : responseError

    res.status(responseError.statusCode).json(payload)

    return 'error'
  } catch (err) {
    logger.error('[sendError] Server error')

    if (err && appConfig.logError.data) {
      logger.error('Error details:', err)
    }

    if (!res.headersSent) {
      res.status(500).json(ResponseErrors.internal_error)
    }

    return 'error'
  }
}

export default sendError