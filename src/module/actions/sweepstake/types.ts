import { listSweepstakesResponseSchema, listSweepstakesQuerySchema, setSweepstakeResultSchema, addSweepstakeGamesSchema, sweepstakeDetailsSchema, updateSweepstakeSchema, createSweepstakeSchema, sweepstakeParamsSchema, joinSweepstakeBodySchema, participationSchema, sweepstakeSchema } from './schemas'

import type { z } from 'zod'

export type SweepstakeDetailsResponse = z.infer<typeof sweepstakeDetailsSchema>

export type ListSweepstakesResponse = z.infer<typeof listSweepstakesResponseSchema>

export type AddSweepstakeGamesRequest = { params: z.infer<typeof sweepstakeParamsSchema>; body: z.infer<typeof addSweepstakeGamesSchema> }

export type SetSweepstakeResultRequest = { params: z.infer<typeof sweepstakeParamsSchema>; body: z.infer<typeof setSweepstakeResultSchema> }

export type UpdateSweepstakeRequest = { params: z.infer<typeof sweepstakeParamsSchema>; body: z.infer<typeof updateSweepstakeSchema> }

export type CreateSweepstakeRequest = { body: z.infer<typeof createSweepstakeSchema> }

export type ListSweepstakesRequest = { query: z.infer<typeof listSweepstakesQuerySchema> }

export type SweepstakeParamsRequest = { params: z.infer<typeof sweepstakeParamsSchema> }

export type DeleteSweepstakeRequest = { params: z.infer<typeof sweepstakeParamsSchema> }

export type JoinSweepstakeRequest = { params: z.infer<typeof sweepstakeParamsSchema>; body: z.infer<typeof joinSweepstakeBodySchema> }

export type ParticipationResponse = z.infer<typeof participationSchema>

export type SweepstakeResponse = z.infer<typeof sweepstakeSchema>