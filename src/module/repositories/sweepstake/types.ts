export type SweepstakeType = {
  id: string
  adminId: string
  title: string
  quotaPrice: number
  prizeValue: number
  availableQuotas: number
  drawDate: string
  purchaseLimitDate: string
  presetId: string
  createdAt: string
  updatedAt: string
}

export type CreateSweepstakePayload = Omit<SweepstakeType, 'id' | 'createdAt' | 'updatedAt'>