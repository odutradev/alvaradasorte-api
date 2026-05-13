import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().openapi({
    example: 10,
    param: { description: 'Quantidade máxima de itens por página' }
  }),
  page: z.coerce.number().min(1).optional().openapi({
    example: 1,
    param: { description: 'Página atual da listagem' }
  })
})

export const createPaginatedSchema = (schema: z.ZodTypeAny, name: string) => z.object({
  meta: z.object({
    totalPages: z.number().openapi({ example: 5 }),
    limit: z.number().openapi({ example: 10 }),
    total: z.number().openapi({ example: 50 }),
    page: z.number().openapi({ example: 1 })
  }),
  data: z.array(schema)
}).openapi(name)