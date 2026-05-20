import { firebaseDb } from '@core/database/connection'

import type { CreatePresetPayload, UpdatePresetPayload, PresetType } from './types'

const REF_PATH = 'presets'

const presetRepository = {
  findAll: async (): Promise<PresetType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, PresetType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, id }))
  },
  findById: async (id: string): Promise<PresetType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return null

    return snapshot.val() as PresetType
  },
  create: async (data: CreatePresetPayload): Promise<PresetType> => {
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string
    const now = new Date().toISOString()
    const payload = { ...data, id, createdAt: now, updatedAt: now }

    await ref.set(payload)

    return payload
  },
  update: async (id: string, data: UpdatePresetPayload): Promise<PresetType | null> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return null

    const now = new Date().toISOString()
    const updates = { ...data, updatedAt: now }

    await ref.update(updates)

    return { ...snapshot.val(), ...updates } as PresetType
  },
  delete: async (id: string): Promise<boolean> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return false

    await ref.remove()

    return true
  }
}

export default presetRepository