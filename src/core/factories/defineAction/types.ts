import type { RequestHandler } from 'express'

export type ResponseConfig = {
  description: string
  schema?: unknown
}

export type ActionMetadata = {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  authenticate?: boolean
  permissions?: string[]
  path: string
  summary: string
  tags: string[]
  security?: Array<Record<string, string[]>>
  responses?: Record<string, ResponseConfig>
  middlewares?: RequestHandler[]
  requestBody?: unknown
}