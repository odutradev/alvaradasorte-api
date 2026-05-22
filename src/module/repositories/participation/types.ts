export type ParticipationType = {
  id: string
  sweepstakeId: string
  userId: string
  userName: string
  userPhone: string
  userDepartment: string
  receiptUrl: string
  createdAt: string
}

export type CreateParticipationPayload = Omit<ParticipationType, 'id' | 'createdAt'>
