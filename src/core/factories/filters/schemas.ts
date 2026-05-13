import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import type { FilterConfig } from '@core/factories/filters/types'

extendZodWithOpenApi(z)

export const createFilterQuerySchema = (config?: FilterConfig) => {
  const exactList = config?.exact?.length ? config.exact.join(', ') : 'nenhum'
  const partialList = config?.partial?.length ? config.partial.join(', ') : 'nenhum'
  const description = `Filtros dinâmicos no formato chave,valor.\n- Campos com busca exata: ${exactList}\n- Campos com busca parcial: ${partialList}`

  return z.object({
    filters: z.string().optional().openapi({
      example: 'chave,valor',
      param: { description }
    })
  })
}