import createLogger from '@core/utils/logger'
import { appConfig } from '@core/config/app'
import sendError from '@core/error'

import type { ManageRequestBody, ManageErrorParams, ServiceFunction, RouteSchema, ManageRequestSchema } from '@core/middlewares/manageRequest/types'
import type { RequestHandler, Response, Request } from 'express'
import type { z } from 'zod'

const logger = createLogger('manage-request')

const formatZodError = (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message
  }))
}

const manageRequest = <T extends ManageRequestSchema = any>(
  service: ServiceFunction<T>,
  schema?: RouteSchema
): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const manageError = ({ code, error, details }: ManageErrorParams): void => {
        sendError({ res, code, error, details, local: service.name })
      }

      if (schema) {
        const payload = {
          params: req.params,
          query: req.query,
          body: req.body
        }

        if (schema.params) {
          const result = schema.params.safeParse(payload.params)

          if (!result.success) return manageError({ code: 'validation_error', error: result.error, details: formatZodError(result.error) })

          req.params = result.data
        }

        if (schema.query) {
          const result = schema.query.safeParse(payload.query)

          if (!result.success) return manageError({ code: 'validation_error', error: result.error, details: formatZodError(result.error) })

          req.query = result.data as any
        }

        if (schema.body) {
          const result = schema.body.safeParse(payload.body)

          if (!result.success) return manageError({ code: 'validation_error', error: result.error, details: formatZodError(result.error) })

          req.body = result.data
        }
      }

      const manageRequestBody: ManageRequestBody<T> = {
        ids: { userId: res.locals?.userId as string | undefined },
        defaultExpress: { req, res },
        params: req.params as T['params'],
        query: req.query as T['query'],
        data: req.body as T['body'],
        manageError
      }

      const result = await service(manageRequestBody)

      if (result === 'error') return
      if (res.headersSent) return

      res.set('api-database-name', appConfig.clusterName)
      res.set('api-version', appConfig.version)
      res.set('api-mode', appConfig.mode)
      res.status(200).json(result)
    } catch (error) {
      if (res.headersSent) {
        logger.error(`Error after headers sent in ${service.name}:`, error)
        return
      }

      logger.error('Request internal error:', error)
      sendError({ code: 'internal_error', res })
    }
  }
}

export default manageRequest