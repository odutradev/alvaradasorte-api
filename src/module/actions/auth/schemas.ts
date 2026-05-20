import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const userSchema = z.object({
  id: z.string().openapi({ example: 'firebase-uid' }),
  name: z.string().openapi({ example: 'John Doe' }),
  email: z.string().email().openapi({ example: 'john@example.com' }),
  photoUrl: z.string().optional().openapi({ example: 'https://example.com/photo.jpg' }),
  authProviderId: z.string().optional().openapi({ example: 'google.com' }),
  createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
}).openapi('UserResponse')

export const syncUserSchema = z.object({
  id: z.string().min(1).openapi({ example: 'firebase-uid' }),
  name: z.string().min(1).openapi({ example: 'John Doe' }),
  email: z.string().email().openapi({ example: 'john@example.com' }),
  photoUrl: z.string().optional().openapi({ example: 'https://example.com/photo.jpg' }),
  authProviderId: z.string().optional().openapi({ example: 'google.com' })
}).openapi('SyncUserRequest')

export const updateUserSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: 'John Doe' }),
  photoUrl: z.string().optional().openapi({ example: 'https://example.com/photo.jpg' })
}).openapi('UpdateUserRequest')

export const syncResponseSchema = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
  user: userSchema
}).openapi('SyncResponse')
