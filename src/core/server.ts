import 'dotenv/config'

import { registeredModules } from '@core/registry'
import database from '@core/database/database'
import createLogger from '@core/utils/logger'
import buildApp from '@core/app'

const logger = createLogger('core')

const startServer = async (): Promise<void> => {
  const app = buildApp()
  const port = process.env.PORT ?? 3000

  app.listen(port, async () => {
    const loadedModules = registeredModules.map((mod) => mod.name).join(', ')

    logger.info(`Server running on port ${port}`)
    logger.info(`Registered modules: [${loadedModules}]`)

    await database.connect()

    const startups = registeredModules.reduce<Array<Promise<void>>>((acc, mod) => {
      return mod.onStartup ? [...acc, mod.onStartup()] : acc
    }, [])

    await Promise.all(startups)
  })
}

startServer().catch(logger.error)