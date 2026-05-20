import { listPresetsResponseSchema, updatePresetSchema, createPresetSchema, presetParamsSchema, presetSchema } from './schemas'

import type { z } from 'zod'

export type UpdatePresetRequest = { body: z.infer<typeof updatePresetSchema>; params: z.infer<typeof presetParamsSchema> }

export type CreatePresetRequest = { body: z.infer<typeof createPresetSchema> }

export type ListPresetsResponse = z.infer<typeof listPresetsResponseSchema>

export type PresetParamsRequest = { params: z.infer<typeof presetParamsSchema> }

export type PresetResponse = z.infer<typeof presetSchema>