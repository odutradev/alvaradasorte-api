import { registry } from '@core/docs/registry'
import iamModule from '@shared/iam/index'

import type { AppModule } from '@core/types/module'

export const registeredModules: AppModule[] = [iamModule]

export const initDocsRegistry = (): void => {
  registeredModules.forEach((mod) => {
    if (mod.registerDocs) mod.registerDocs(registry)
  })
}