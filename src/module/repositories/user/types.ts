export type UserType = {
  id: string
  name: string
  email: string
  photoUrl?: string
  authProviderId?: string
  createdAt: string
  updatedAt: string
}

export type CreateUserPayload = Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateUserPayload = Partial<Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>>