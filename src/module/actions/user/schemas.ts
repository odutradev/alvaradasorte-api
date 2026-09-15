import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@core/factories/pagination/schemas'
import { createFilterQuerySchema } from '@core/factories/filters/schemas'

import type { FilterConfig } from '@core/factories/filters/types'

extendZodWithOpenApi(z)

export const userFiltersConfig: FilterConfig = {
  partial: ['name', 'email', 'fullName', 'department'],
  exact: ['role', 'id']
}

export const userParamsSchema = z.object({
  id: z.string().openapi({ example: 'user-123' })
}).openapi('UserParams')

export const userSchema = z.object({
  id: z.string().openapi({ example: 'user-123' }),
  role: z.enum(['admin', 'user']).openapi({ example: 'user' }),
  name: z.string().openapi({ example: 'João Silva' }),
  email: z.string().email().openapi({ example: 'joao@email.com' }),
  fullName: z.string().optional().openapi({ example: 'João da Silva' }),
  department: z.string().optional().openapi({ example: 'TI' }),
  phone: z.string().optional().openapi({ example: '11999999999' }),
  photoUrl: z.string().optional().openapi({ example: 'https://example.com/photo.jpg' }),
  authProviderId: z.string().optional().openapi({ example: 'google' }),
  createdAt: z.string().openapi({ example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2026-01-01T00:00:00.000Z' })
}).openapi('UserResponse')

export const updateUserSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: 'João Silva' }),
  email: z.string().email().optional().openapi({ example: 'joao@email.com' }),
  fullName: z.string().optional().openapi({ example: 'João da Silva' }),
  department: z.string().optional().openapi({ example: 'TI' }),
  phone: z.string().optional().openapi({ example: '11999999999' }),
  role: z.enum(['admin', 'user']).optional().openapi({ example: 'admin' })
}).openapi('UpdateUser')

export const listUsersQuerySchema = z.object({
  search: z.string().optional().openapi({ example: 'joao' }),
  role: z.string().optional().openapi({ example: 'admin' })
}).merge(paginationQuerySchema).merge(createFilterQuerySchema(userFiltersConfig)).openapi('ListUsersQuery')

export const listUsersResponseSchema = createPaginatedSchema(userSchema, 'ListUsersResponse')
