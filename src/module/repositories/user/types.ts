import type { PaginationParams } from '@core/factories/pagination/types'

export type UserType = {
  id: string
  role: 'admin' | 'user'
  name: string
  email: string
  fullName?: string
  department?: string
  phone?: string
  photoUrl?: string
  authProviderId?: string
  createdAt: string
  updatedAt: string
}

export type CreateUserPayload = Omit<UserType, 'id' | 'createdAt' | 'updatedAt' | 'role'>

export type UpdateUserPayload = Partial<Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>>

export type FindAllUserFilters = PaginationParams & {
  filters?: string
  search?: string
}