import { registry } from '@core/docs/registry'
import defaultModule from '@module/index'

import type { AppModule } from '@core/types/module'

export const registeredModules: AppModule[] = [defaultModule]

export const initDocsRegistry = (): void => {
  registeredModules.forEach((mod) => {
    if (mod.registerDocs) mod.registerDocs(registry)
  })
}