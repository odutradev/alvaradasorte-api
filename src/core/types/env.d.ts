declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    PORT?: string
    CORS_ORIGIN?: string
    FIREBASE_MESSAGING_SENDER_ID: string
    FIREBASE_STORAGE_BUCKET: string
    FIREBASE_AUTH_DOMAIN: string
    FIREBASE_PROJECT_ID: string
    FIREBASE_API_KEY: string
    FIREBASE_APP_ID: string
    FIREBASE_MEASUREMENT_ID: string
    FIREBASE_DATABASE_URL: string
    FIREBASE_CLIENT_EMAIL: string
    FIREBASE_PRIVATE_KEY: string
  }
}