import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const participationSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' }),
  sweepstakeId: z.string().openapi({ example: 'bolao-id' }),
  userId: z.string().openapi({ example: 'user-uid' }),
  userName: z.string().openapi({ example: 'John Doe' }),
  userPhone: z.string().openapi({ example: '(34) 99999-0000' }),
  userDepartment: z.string().openapi({ example: 'Tecnologia' }),
  receiptUrl: z.string().openapi({ example: 'receipts/bolao-id/user-uid-123456789.png' }),
  quotaCount: z.number().int().min(1).default(1).openapi({ example: 2 }),
  createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
}).openapi('ParticipationResponse')

export const sweepstakeSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' }),
  adminId: z.string().openapi({ example: 'admin-uid' }),
  title: z.string().openapi({ example: 'Bolão da Copa' }),
  description: z.string().openapi({ example: 'Participe do bolão oficial!' }),
  quotaPrice: z.number().openapi({ example: 50.0 }),
  prizeValue: z.number().openapi({ example: 1000.0 }),
  availableQuotas: z.number().openapi({ example: 20 }),
  drawDate: z.string().openapi({ example: '2023-12-20T20:00:00.000Z' }),
  purchaseLimitDate: z.string().openapi({ example: '2023-12-19T23:59:59.000Z' }),
  presetId: z.string().openapi({ example: 'preset-id' }),
  games: z.array(z.array(z.number())).optional().openapi({ example: [[1, 2, 3, 4], [5, 6, 7, 8]] }),
  result: z.array(z.number()).optional().openapi({ example: [1, 2, 3, 4] }),
  createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
}).openapi('SweepstakeResponse')

export const sweepstakeDetailsSchema = sweepstakeSchema.extend({
  participations: z.array(participationSchema)
}).openapi('SweepstakeDetailsResponse')

export const sweepstakeListItemSchema = sweepstakeSchema.extend({
  metadata: z.object({
    filledQuotas: z.number().openapi({ example: 5 })
  }),
  userParticipation: z.object({
    isParticipant: z.boolean().openapi({ example: true }),
    quotaCount: z.number().int().min(0).openapi({ example: 2 }),
    joinedAt: z.string().nullable().openapi({ example: '2023-01-01T00:00:00.000Z' })
  }).optional()
}).openapi('SweepstakeListItemResponse')

export const joinSweepstakeBodySchema = z.object({
  quotaCount: z.coerce.number().int().min(1).default(1).openapi({ example: 1 })
}).openapi('JoinSweepstakeBody')

export const createSweepstakeSchema = z.object({
  title: z.string().min(1).openapi({ example: 'Bolão da Copa' }),
  description: z.string().min(1).openapi({ example: 'Participe do bolão oficial!' }),
  quotaPrice: z.number().min(0.01).openapi({ example: 50.0 }),
  prizeValue: z.number().min(0.01).openapi({ example: 1000.0 }),
  availableQuotas: z.number().min(1).openapi({ example: 20 }),
  drawDate: z.string().datetime().openapi({ example: '2023-12-20T20:00:00.000Z' }),
  purchaseLimitDate: z.string().datetime().openapi({ example: '2023-12-19T23:59:59.000Z' }),
  presetId: z.string().min(1).openapi({ example: 'preset-id' })
}).openapi('CreateSweepstakeRequest')

export const updateSweepstakeSchema = z.object({
  title: z.string().min(1).optional().openapi({ example: 'Bolão da Copa Atualizado' }),
  description: z.string().min(1).optional().openapi({ example: 'Nova descrição' }),
  quotaPrice: z.number().min(0.01).optional().openapi({ example: 60.0 }),
  prizeValue: z.number().min(0.01).optional().openapi({ example: 1200.0 }),
  availableQuotas: z.number().min(1).optional().openapi({ example: 30 }),
  drawDate: z.string().datetime().optional().openapi({ example: '2023-12-25T20:00:00.000Z' }),
  purchaseLimitDate: z.string().datetime().optional().openapi({ example: '2023-12-24T23:59:59.000Z' }),
  presetId: z.string().min(1).optional().openapi({ example: 'new-preset-id' })
}).openapi('UpdateSweepstakeRequest')

export const addSweepstakeGamesSchema = z.object({
  games: z.array(z.array(z.number().int().min(1)).min(1)).min(1).openapi({ example: [[1, 2, 3, 4], [5, 6, 7, 8]] })
}).openapi('AddSweepstakeGamesRequest')

export const setSweepstakeResultSchema = z.object({
  result: z.array(z.number().int().min(1)).min(1).openapi({ example: [1, 2, 3, 4] })
}).openapi('SetSweepstakeResultRequest')

export const listSweepstakesResponseSchema = z.array(sweepstakeListItemSchema).openapi('ListSweepstakesResponse')

export const listSweepstakesQuerySchema = z.object({
  userId: z.string().optional().openapi({ example: 'user-uid' })
}).openapi('ListSweepstakesQuery')

export const sweepstakeParamsSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' })
})

export const addManualParticipationBodySchema = z.object({
  email: z.string().email().openapi({ example: 'usuario@exemplo.com' }),
  quotaCount: z.number().int().min(1).optional().default(1).openapi({ example: 1 })
}).openapi('AddManualParticipationBody')

export const deleteParticipationParamsSchema = z.object({
  id: z.string().openapi({ example: 'bolao-id' }),
  participationId: z.string().openapi({ example: 'participacao-id' })
}).openapi('DeleteParticipationParams')