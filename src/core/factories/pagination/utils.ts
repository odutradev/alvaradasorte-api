import type { PaginatedResponse, PaginatedData, PaginationQuery } from '@core/factories/pagination/types'

export const getPaginationOptions = (query?: PaginationQuery) => {
  const page = Math.max(1, query?.page ?? 1)
  const limit = Math.max(1, Math.min(100, query?.limit ?? 10))
  const offset = (page - 1) * limit

  return { limit, offset, page }
}

export const buildPaginatedResponse = <T>(data: PaginatedData<T>, page: number, limit: number): PaginatedResponse<T> => {
  const totalPages = Math.ceil(data.count / limit)

  return {
    meta: {
      total: data.count,
      totalPages,
      limit,
      page
    },
    data: data.rows
  }
}