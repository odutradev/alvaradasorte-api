import { paginationQuerySchema } from '@core/factories/pagination/schemas'

import type { z } from 'zod'

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export type PaginatedData<T> = {
  count: number
  rows: T[]
}

export type PaginatedResponse<T> = {
  meta: {
    totalPages: number
    limit: number
    total: number
    page: number
  }
  data: T[]
}