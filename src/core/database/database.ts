import { firebaseApp } from '@core/database/connection'
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
  connect: async (): Promise<{ clusterName: string }> => {
    try {
      await loadModels()

      const projectId = process.env.FIREBASE_PROJECT_ID ?? 'unknown'

      logger.success(`Connected: Firebase App (${projectId})`)

      return { clusterName: projectId }
    } catch (error) {
      logger.error('Connection error:', error)
      process.exit(1)
    }
  },
  disconnect: async (): Promise<void> => {
    await firebaseApp.delete()
  },
  isValidUUID: (id: string): boolean => {
    if (!id || typeof id !== 'string') return false
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }
}

export default database