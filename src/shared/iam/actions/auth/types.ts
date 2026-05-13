import { syncUserSchema, userSchema } from './schemas'

import type { z } from 'zod'

export type SyncUserRequest = { body: z.infer<typeof syncUserSchema> }

export type UserResponse = z.infer<typeof userSchema>