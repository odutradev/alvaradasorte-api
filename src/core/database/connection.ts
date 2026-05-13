import * as admin from 'firebase-admin'

const getPrivateKey = (): string => {
  const key = process.env.FIREBASE_PRIVATE_KEY

  if (!key) return ''

  return key.replace(/\\n/g, '\n')
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey()
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
}

export const firebaseApp = admin.app()
export const firebaseAuth = admin.auth()
export const firebaseDb = admin.database()
export const firebaseStorage = admin.storage()