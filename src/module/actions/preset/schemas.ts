import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const presetSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' }),
  adminId: z.string().openapi({ example: 'admin-uid' }),
  description: z.string().openapi({ example: 'Conta Principal' }),
  pix: z.string().openapi({ example: '31999999999' }),
  receiverName: z.string().openapi({ example: 'John Doe' }),
  bank: z.string().openapi({ example: 'Nubank' }),
  createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
}).openapi('PresetResponse')

export const createPresetSchema = z.object({
  description: z.string().min(1).openapi({ example: 'Conta Principal' }),
  pix: z.string().min(1).openapi({ example: '31999999999' }),
  receiverName: z.string().min(1).openapi({ example: 'John Doe' }),
  bank: z.string().min(1).openapi({ example: 'Nubank' })
}).openapi('CreatePresetRequest')

export const updatePresetSchema = z.object({
  description: z.string().min(1).optional().openapi({ example: 'Conta Secundária' }),
  pix: z.string().min(1).optional().openapi({ example: 'email@pix.com' }),
  receiverName: z.string().min(1).optional().openapi({ example: 'Jane Doe' }),
  bank: z.string().min(1).optional().openapi({ example: 'Inter' })
}).openapi('UpdatePresetRequest')

export const listPresetsResponseSchema = z.array(presetSchema).openapi('ListPresetsResponse')

export const presetParamsSchema = z.object({
  id: z.string().openapi({ example: 'chave-unica' })
})