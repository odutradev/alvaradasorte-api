import { firebaseDb } from '@core/database/connection'

import type { CreateSweepstakePayload, UpdateSweepstakePayload, SweepstakeType } from './types'

const REF_PATH = 'sweepstakes'

const sweepstakeRepository = {
  findAll: async (): Promise<SweepstakeType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, SweepstakeType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, id }))
  },
  findById: async (id: string): Promise<SweepstakeType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return null

    return snapshot.val() as SweepstakeType
  },
  create: async (data: CreateSweepstakePayload): Promise<SweepstakeType> => {
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string
    const now = new Date().toISOString()
    const payload = { ...data, id, createdAt: now, updatedAt: now }

    await ref.set(payload)

    return payload
  },
  update: async (id: string, data: UpdateSweepstakePayload): Promise<SweepstakeType | null> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return null

    const now = new Date().toISOString()
    const merged = { ...snapshot.val(), ...data, updatedAt: now }

    await ref.set(merged)

    return merged as SweepstakeType
  }
}

export default sweepstakeRepository
