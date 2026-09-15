import { listUsersQuerySchema, listUsersResponseSchema, updateUserSchema, userParamsSchema, userSchema } from './schemas'

import type { z } from 'zod'

export type UpdateUserRequest = { body: z.infer<typeof updateUserSchema>; params: z.infer<typeof userParamsSchema> }

export type UserParamsRequest = { params: z.infer<typeof userParamsSchema> }

export type ListUsersRequest = { query: z.infer<typeof listUsersQuerySchema> }

export type UserResponse = z.infer<typeof userSchema>

export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>
