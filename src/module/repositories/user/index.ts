import { firebaseDb } from '@core/database/connection'

import type { CreateUserPayload, UpdateUserPayload, UserType } from './types'

const REF_PATH = 'users'

const userRepository = {
  findById: async (id: string): Promise<UserType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return null

    return snapshot.val() as UserType
  },
  findByEmail: async (email: string): Promise<UserType | null> => {
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('email').equalTo(email).once('value')

    if (!snapshot.exists()) return null

    const data = snapshot.val()
    const keys = Object.keys(data)

    return data[keys[0]] as UserType
  },
  upsert: async (id: string, data: CreateUserPayload): Promise<UserType> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')
    const exists = snapshot.exists()
    const now = new Date().toISOString()

    const payload = exists
      ? { ...snapshot.val(), ...data, updatedAt: now }
      : { ...data, id, role: 'user', createdAt: now, updatedAt: now }

    await ref.set(payload)

    return payload as UserType
  },
  update: async (id: string, data: UpdateUserPayload): Promise<UserType | null> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return null

    const now = new Date().toISOString()
    const updates = { ...data, updatedAt: now }

    await ref.update(updates)

    return { ...snapshot.val(), ...updates } as UserType
  }
}

export default userRepository