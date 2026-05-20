export type ParticipationType = {
  id: string
  sweepstakeId: string
  userId: string
  userName: string
  receiptUrl: string
  createdAt: string
}

export type CreateParticipationPayload = Omit<ParticipationType, 'id' | 'createdAt'>