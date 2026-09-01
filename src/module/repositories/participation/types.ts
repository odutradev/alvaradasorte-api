export type ParticipationType = {
  id: string
  sweepstakeId: string
  userId: string
  userName: string
  userPhone: string
  userDepartment: string
  receiptUrl: string
  quotaCount: number
  createdAt: string
}

export type CreateParticipationPayload = Omit<ParticipationType, 'id' | 'createdAt'> & {
  quotaCount?: number
}
