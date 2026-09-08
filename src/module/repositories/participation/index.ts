import { firebaseDb, firebaseStorage } from '@core/database/connection'

import type { CreateParticipationPayload, ParticipationType } from './types'

const REF_PATH = 'participations'

const participationRepository = {
  findAll: async (): Promise<ParticipationType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, ParticipationType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, quotaCount: item.quotaCount ?? 1, id }))
  },
  findBySweepstakeId: async (sweepstakeId: string): Promise<ParticipationType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('sweepstakeId').equalTo(sweepstakeId).once('value')
    const data = snapshot.val() as Record<string, ParticipationType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, quotaCount: item.quotaCount ?? 1, id }))
  },
  findByUserAndSweepstake: async (userId: string, sweepstakeId: string): Promise<ParticipationType | null> => {
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('sweepstakeId').equalTo(sweepstakeId).once('value')
    const data = snapshot.val() as Record<string, ParticipationType> | null

    if (!data) return null

    const participations = Object.entries(data).map(([id, item]) => ({ ...item, quotaCount: item.quotaCount ?? 1, id }))
    const found = participations.find((p) => p.userId === userId)

    return found ?? null
  },
  create: async (data: CreateParticipationPayload): Promise<ParticipationType> => {
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string
    const now = new Date().toISOString()
    const payload = { ...data, quotaCount: data.quotaCount ?? 1, id, createdAt: now }

    await ref.set(payload)

    return payload
  },
  findById: async (id: string): Promise<ParticipationType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return null

    const data = snapshot.val() as ParticipationType

    return { ...data, quotaCount: data.quotaCount ?? 1, id }
  },
  delete: async (id: string): Promise<boolean> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return false

    const participation = snapshot.val() as ParticipationType

    if (participation.receiptUrl) {
      try {
        const bucket = firebaseStorage.bucket()
        await bucket.file(participation.receiptUrl).delete()
      } catch {}
    }

    await firebaseDb.ref(`${REF_PATH}/${id}`).remove()

    return true
  },
  deleteBySweepstakeId: async (sweepstakeId: string): Promise<void> => {
    const participations = await participationRepository.findBySweepstakeId(sweepstakeId)

    try {
      const bucket = firebaseStorage.bucket()
      await bucket.deleteFiles({ prefix: `receipts/${sweepstakeId}/` })
    } catch {}

    const updates: Record<string, null> = {}

    participations.forEach((p) => {
      updates[`${REF_PATH}/${p.id}`] = null
    })

    if (Object.keys(updates).length > 0) {
      await firebaseDb.ref().update(updates)
    }
  }
}

export default participationRepository