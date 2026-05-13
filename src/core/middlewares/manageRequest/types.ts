import type { ResponseErrorsParams } from '@core/error/types'
import type { Request, Response } from 'express'
import type { z } from 'zod'

export type ManageRequestResponse<T = any> = Promise<T | void | 'error'>

export type ManageRequestSchema = {
  params?: any
  query?: any
  body?: any
}

export type ManageErrorParams = {
  code: ResponseErrorsParams
  error?: unknown
  details?: unknown
}

export type DefaultExpressContext = {
  res: Response
  req: Request
}

export type RequestIdentifiers = {
  userId?: string
}

export type RouteSchema = {
  params?: z.AnyZodObject
  query?: z.AnyZodObject
  body?: z.AnyZodObject
}

export type ManageRequestBody<T extends ManageRequestSchema = any> = {
  manageError: (data: ManageErrorParams) => void
  defaultExpress: DefaultExpressContext
  ids: RequestIdentifiers
  params: T['params']
  query: T['query']
  data: T['body']
}

export type ServiceFunction<T extends ManageRequestSchema = any> = (
  requestBody: ManageRequestBody<T>
) => ManageRequestResponse | any