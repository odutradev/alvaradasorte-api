export type PresetType = {
  id: string
  adminId: string
  description: string
  pix: string
  receiverName: string
  bank: string
  createdAt: string
  updatedAt: string
}

export type CreatePresetPayload = Omit<PresetType, 'id' | 'createdAt' | 'updatedAt'>

export type UpdatePresetPayload = Partial<Omit<PresetType, 'id' | 'createdAt' | 'updatedAt' | 'adminId'>>