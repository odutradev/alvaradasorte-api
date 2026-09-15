import { getPaginationOptions, buildPaginatedResponse } from '@core/factories/pagination/utils'
import { parseFilters, applyInMemoryFilters } from '@core/factories/filters/utils'
import { userFiltersConfig } from '@module/actions/user/schemas'
import { firebaseDb } from '@core/database/connection'

import type { FindAllUserFilters, CreateUserPayload, UpdateUserPayload, UserType } from './types'
import type { PaginatedResponse } from '@core/factories/pagination/types'

const REF_PATH = 'users'

const userRepository = {
  findAll: async (filters?: FindAllUserFilters): Promise<PaginatedResponse<UserType>> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, UserType> | null

    const parsedFilters = parseFilters(filters?.filters, userFiltersConfig)
    const options = getPaginationOptions(filters)

    let rows: UserType[] = []

    if (data) {
      const arrayData = Object.entries(data).map(([id, item]) => ({ ...item, id }))
      rows = applyInMemoryFilters(arrayData, parsedFilters, userFiltersConfig)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      rows = rows.filter((user) =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.fullName?.toLowerCase().includes(searchLower)
      )
    }

    const count = rows.length
    const paginatedRows = rows.slice(options.offset, options.offset + options.limit)

    return buildPaginatedResponse({ rows: paginatedRows, count }, options.page, options.limit)
  },
  findById: async (id: string): Promise<UserType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return null

    return snapshot.val() as UserType
  },
  findByEmail: async (email: string): Promise<UserType | null> => {
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('email').equalTo(email).once('value')

    if (!snapshot.exists()) return null

    const data = snapshot.val()
    const keys = Object.keys(data)

    return data[keys[0]] as UserType
  },
  upsert: async (id: string, data: CreateUserPayload): Promise<UserType> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')
    const exists = snapshot.exists()
    const now = new Date().toISOString()

    const payload = exists
      ? { ...snapshot.val(), ...data, updatedAt: now }
      : { ...data, id, role: 'user', createdAt: now, updatedAt: now }

    await ref.set(payload)

    return payload as UserType
  },
  update: async (id: string, data: UpdateUserPayload): Promise<UserType | null> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return null

    const now = new Date().toISOString()
    const updates = { ...data, updatedAt: now }

    await ref.update(updates)

    return { ...snapshot.val(), ...updates } as UserType
  },
  delete: async (id: string): Promise<boolean> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return false

    await ref.remove()

    return true
  }
}

export default userRepository