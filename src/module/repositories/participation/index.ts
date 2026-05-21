import { firebaseDb } from '@core/database/connection'

import type { CreateParticipationPayload, ParticipationType } from './types'

const REF_PATH = 'participations'

const participationRepository = {
  findAll: async (): Promise<ParticipationType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, ParticipationType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, id }))
  },
  findBySweepstakeId: async (sweepstakeId: string): Promise<ParticipationType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('sweepstakeId').equalTo(sweepstakeId).once('value')
    const data = snapshot.val() as Record<string, ParticipationType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, id }))
  },
  findByUserAndSweepstake: async (userId: string, sweepstakeId: string): Promise<ParticipationType | null> => {
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('sweepstakeId').equalTo(sweepstakeId).once('value')
    const data = snapshot.val() as Record<string, ParticipationType> | null

    if (!data) return null

    const participations = Object.entries(data).map(([id, item]) => ({ ...item, id }))
    const found = participations.find((p) => p.userId === userId)

    return found ?? null
  },
  create: async (data: CreateParticipationPayload): Promise<ParticipationType> => {
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string
    const now = new Date().toISOString()
    const payload = { ...data, id, createdAt: now }

    await ref.set(payload)

    return payload
  }
}

export default participationRepository