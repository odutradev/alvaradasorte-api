import { syncResponseSchema, updateUserSchema, syncUserSchema, userSchema } from './schemas'

import type { z } from 'zod'

export type UpdateUserRequest = { body: z.infer<typeof updateUserSchema> }

export type SyncUserResponse = z.infer<typeof syncResponseSchema>

export type SyncUserRequest = { body: z.infer<typeof syncUserSchema> }

export type UserResponse = z.infer<typeof userSchema>
