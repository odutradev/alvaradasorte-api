import type { ResponseErrorsParams } from '@core/error/types'
import type { Request, Response } from 'express'
import type { z } from 'zod'

export type FileData = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  buffer: Buffer
}

export type ManageRequestResponse<T = unknown> = Promise<T | void | 'error'>

export type ManageRequestSchema = {
  params?: unknown
  query?: unknown
  body?: unknown
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

export type ManageRequestBody<T extends ManageRequestSchema = unknown> = {
  manageError: (data: ManageErrorParams) => void
  defaultExpress: DefaultExpressContext
  ids: RequestIdentifiers
  params: T['params']
  query: T['query']
  data: T['body']
  file?: FileData
}

export type ServiceFunction<T extends ManageRequestSchema = unknown> = (
  requestBody: ManageRequestBody<T>
) => ManageRequestResponse | unknown