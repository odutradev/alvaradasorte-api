import swaggerUi from 'swagger-ui-express'

import { initDocsRegistry, registeredModules } from '@core/registry'
import { generateDocs } from '@core/docs/generator'
import { appConfig } from '@core/config/app'

import type { Application, Response, Request } from 'express'

const registerGlobalRoutes = (app: Application): void => {
  initDocsRegistry()

  app.get('/health', (req: Request, res: Response) => {
    const modules = registeredModules.map((mod) => mod.name)

    res.status(200).json({
      status: 'ok',
      mode: appConfig.mode,
      version: appConfig.version,
      modules
    })
  })

  const spec = generateDocs()

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, { swaggerOptions: { persistAuthorization: true } }))

  registeredModules.forEach((mod) => {
    if (!mod.routePrefix || !mod.router) return

    app.use(mod.routePrefix, mod.router)
  })
}

export default registerGlobalRoutes