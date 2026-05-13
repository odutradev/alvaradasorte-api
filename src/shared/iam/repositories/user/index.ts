import { firebaseDb } from '@core/database/connection'

import type { CreateUserPayload, UserType } from './types'

const REF_PATH = 'users'

const userRepository = {
  findById: async (id: string): Promise<UserType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')
    
    if (!snapshot.exists()) return null

    return snapshot.val() as UserType
  },
  upsert: async (id: string, data: CreateUserPayload): Promise<UserType> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')
    const exists = snapshot.exists()
    const now = new Date().toISOString()
    
    const payload = exists 
      ? { ...snapshot.val(), ...data, updatedAt: now }
      : { ...data, id, createdAt: now, updatedAt: now }

    await ref.set(payload)
    
    return payload as UserType
  }
}

export default userRepository