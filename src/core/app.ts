import express from 'express'

import registerGlobalRoutes from '@core/routes/index'
import configureCors from '@core/config/cors'

import type { Application } from 'express'

const buildApp = (): Application => {
  const app = express()

  app.use(configureCors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  registerGlobalRoutes(app)

  return app
}

export default buildApp