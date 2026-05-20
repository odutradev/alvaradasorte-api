import { listSweepstakesResponseSchema, sweepstakeDetailsSchema, createSweepstakeSchema, sweepstakeParamsSchema, participationSchema, sweepstakeSchema } from './schemas'

import type { z } from 'zod'

export type CreateSweepstakeRequest = { body: z.infer<typeof createSweepstakeSchema> }

export type SweepstakeDetailsResponse = z.infer<typeof sweepstakeDetailsSchema>

export type ListSweepstakesResponse = z.infer<typeof listSweepstakesResponseSchema>

export type SweepstakeParamsRequest = { params: z.infer<typeof sweepstakeParamsSchema> }

export type JoinSweepstakeRequest = { params: z.infer<typeof sweepstakeParamsSchema> }

export type ParticipationResponse = z.infer<typeof participationSchema>

export type SweepstakeResponse = z.infer<typeof sweepstakeSchema>