declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    DB_PASSWORD?: string
    CORS_ORIGIN?: string
    DB_HOST?: string
    DB_NAME?: string
    DB_PORT?: string
    DB_USER?: string
    PORT?: string
  }
}