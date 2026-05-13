import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import type { Router } from 'express'

export type AppModule = {
  name: string
  routePrefix?: string
  router?: Router
  loadModels?: () => Promise<void>
  onStartup?: () => Promise<void>
  registerDocs?: (registry: OpenAPIRegistry) => void
}