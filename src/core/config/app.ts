export const appConfig = {
  clusterName: process.env.DB_NAME ?? 'uailab',
  version: process.env.npm_package_version ?? '1.0.0',
  mode: process.env.NODE_ENV ?? 'development',
  logError: {
    message: true,
    data: true
  }
} as const