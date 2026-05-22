import type { z } from 'zod'

import { listSweepstakesResponseSchema, listSweepstakesQuerySchema, sweepstakeDetailsSchema, addSweepstakeGamesSchema, setSweepstakeResultSchema, createSweepstakeSchema, sweepstakeParamsSchema, participationSchema, sweepstakeSchema } from './schemas'

export type SweepstakeDetailsResponse = z.infer<typeof sweepstakeDetailsSchema>

export type ListSweepstakesResponse = z.infer<typeof listSweepstakesResponseSchema>

export type AddSweepstakeGamesRequest = { params: z.infer<typeof sweepstakeParamsSchema>; body: z.infer<typeof addSweepstakeGamesSchema> }

export type SetSweepstakeResultRequest = { params: z.infer<typeof sweepstakeParamsSchema>; body: z.infer<typeof setSweepstakeResultSchema> }

export type CreateSweepstakeRequest = { body: z.infer<typeof createSweepstakeSchema> }

export type ListSweepstakesRequest = { query: z.infer<typeof listSweepstakesQuerySchema> }

export type SweepstakeParamsRequest = { params: z.infer<typeof sweepstakeParamsSchema> }

export type JoinSweepstakeRequest = { params: z.infer<typeof sweepstakeParamsSchema> }

export type ParticipationResponse = z.infer<typeof participationSchema>

export type SweepstakeResponse = z.infer<typeof sweepstakeSchema>
