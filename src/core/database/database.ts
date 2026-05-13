import { sequelize } from '@core/database/connection'
import { registeredModules } from '@core/registry'
import createLogger from '@core/utils/logger'

const logger = createLogger('database')

const loadModels = async (): Promise<void> => {
  const loaders = registeredModules.reduce<Array<Promise<void>>>((acc, mod) => {
    return mod.loadModels ? [...acc, mod.loadModels()] : acc
  }, [])

  await Promise.all(loaders)
}

const database = {
  connectSequelize: async (): Promise<{ clusterName: string }> => {
    try {
      await sequelize.authenticate()
      await loadModels()

      const isDeveloping = process.env.NODE_ENV !== 'production'

      await sequelize.sync({ alter: isDeveloping })

      const [results] = await sequelize.query('SELECT current_database()')
      const rows = results as Array<Record<string, unknown>>
      const databaseName = String(rows[0]?.current_database ?? 'unknown')

      logger.success(`Connected: ${databaseName}`)

      return { clusterName: databaseName }
    } catch (error) {
      logger.error('Connection error:', error)
      process.exit(1)
    }
  },
  disconnect: async (): Promise<void> => {
    await sequelize.close()
  },
  isValidUUID: (id: string): boolean => {
    if (!id || typeof id !== 'string') return false
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  },
  isValidObjectId: (id: string): boolean => {
    return database.isValidUUID(id)
  },
  sequelize
}

export default database