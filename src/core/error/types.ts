import { ResponseErrors } from '@core/error/constants'

import type { Response } from 'express'

export type ResponseError = {
  statusCode: 100 | 101 | 102 | 200 | 201 | 202 | 204 | 301 | 302 | 304 | 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 501 | 502 | 503
  message: string
  details?: unknown
}

export type ResponseErrorsParams = keyof typeof ResponseErrors

export type SendErrorParams = {
  code: ResponseErrorsParams
  res: Response
  local?: string
  options?: Record<string, unknown>
  error?: unknown
  details?: unknown
}