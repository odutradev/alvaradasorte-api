import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const participationSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' }),
  sweepstakeId: z.string().openapi({ example: 'bolao-id' }),
  userId: z.string().openapi({ example: 'user-uid' }),
  userName: z.string().openapi({ example: 'John Doe' }),
  receiptUrl: z.string().openapi({ example: 'https://link.com/comprovante.jpg' }),
  createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
}).openapi('ParticipationResponse')

export const sweepstakeSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' }),
  adminId: z.string().openapi({ example: 'admin-uid' }),
  title: z.string().openapi({ example: 'Bolão da Copa' }),
  quotaPrice: z.number().openapi({ example: 50.0 }),
  prizeValue: z.number().openapi({ example: 1000.0 }),
  availableQuotas: z.number().openapi({ example: 20 }),
  drawDate: z.string().openapi({ example: '2023-12-20T20:00:00.000Z' }),
  purchaseLimitDate: z.string().openapi({ example: '2023-12-19T23:59:59.000Z' }),
  presetId: z.string().openapi({ example: 'preset-id' }),
  createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
}).openapi('SweepstakeResponse')

export const sweepstakeDetailsSchema = sweepstakeSchema.extend({
  participations: z.array(participationSchema)
}).openapi('SweepstakeDetailsResponse')

export const createSweepstakeSchema = z.object({
  title: z.string().min(1).openapi({ example: 'Bolão da Copa' }),
  quotaPrice: z.number().min(0.01).openapi({ example: 50.0 }),
  prizeValue: z.number().min(0.01).openapi({ example: 1000.0 }),
  availableQuotas: z.number().min(1).openapi({ example: 20 }),
  drawDate: z.string().datetime().openapi({ example: '2023-12-20T20:00:00.000Z' }),
  purchaseLimitDate: z.string().datetime().openapi({ example: '2023-12-19T23:59:59.000Z' }),
  presetId: z.string().min(1).openapi({ example: 'preset-id' })
}).openapi('CreateSweepstakeRequest')

export const joinSweepstakeSchema = z.object({
  receiptUrl: z.string().url().openapi({ example: 'https://link.com/comprovante.jpg' })
}).openapi('JoinSweepstakeRequest')

export const listSweepstakesResponseSchema = z.array(sweepstakeSchema).openapi('ListSweepstakesResponse')

export const sweepstakeParamsSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' })
})