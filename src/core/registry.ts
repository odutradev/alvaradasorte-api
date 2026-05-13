import { registry } from '@core/docs/registry'


import type { AppModule } from '@core/types/module'

export const registeredModules: AppModule[] = []

export const initDocsRegistry = (): void => {
  registeredModules.forEach((mod) => {
    if (mod.registerDocs) mod.registerDocs(registry)
  })
}