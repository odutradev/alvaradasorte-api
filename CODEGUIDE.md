## **Comandos Disponíveis**

* npm run dev: Inicia o servidor em modo de desenvolvimento (watch).  
* npm run build: Compila o projeto para o diretório dist/.  
* npm start: Inicia o servidor em modo de produção (a partir do dist/).  
* npm run docs:swagger: Gera o arquivo JSON do Swagger na pasta cache/docs/.  
* npm run docs:postman: Gera a coleção Postman na pasta cache/docs/.  

## **Guia Estrutural e Arquitetural de Módulos**

Este documento define as regras estritas para a criação de novos módulos na API. Todo novo módulo deve seguir esta estrutura baseando-se no módulo de referência src/shared/iam.

### **Estrutura de Diretórios Obrigatória**

Os módulos devem ser alocados em duas pastas principais dentro de src/, dependendo do seu escopo e finalidade:

* **src/shared/**: Destinado a módulos de configurações gerais, integrações e domínios base que podem ser utilizados por outras partes do sistema (ex: src/shared/iam).  
* **src/modules/**: Destinado ao restante dos módulos, focado nas funcionalidades e regras de negócio específicas da aplicação (ex: src/modules/meu-modulo).

Independentemente de estar em shared ou modules, um módulo completo deve possuir a seguinte estrutura interna de pastas e arquivos:

* index.ts (Ponto de entrada e definição do módulo)  
* routes/index.ts (Orquestrador de rotas Express)  
* repositories/ (Camada de acesso a dados usando Firebase Realtime Database)  
  * entidade/index.ts  
  * entidade/types.ts  
* actions/ (Controladores lógicos e definição OpenAPI)  
  * entidade/index.ts (Lógica e defineAction)  
  * entidade/schemas.ts (Schemas Zod estendidos com OpenAPI)  
  * entidade/types.ts (Tipagens inferidas dos schemas Zod)

### **Regras de Implementação por Camada**

#### **1\. Definição do Módulo (index.ts principal)**

Todo módulo deve exportar um objeto do tipo AppModule contendo seu nome, roteador, e prefixo.

```ts
import rotasMeuModulo from '@modules/meu-modulo/routes/index'  

import type { AppModule } from '@core/types/module'

const meuModulo: AppModule = {  
  name: 'meu-modulo',  
  router: rotasMeuModulo,  
  routePrefix: '/meu-modulo/v1'
}

export default meuModulo
```

#### **2\. Ações / Controllers (actions/entidade/index.ts)**

As ações **não usam** controllers tradicionais do Express. Elas usam a factory defineAction que integra rotas, validação Zod, OpenAPI e injeção de dependências (ids, manageError).

```ts
import defineAction from '@core/factories/defineAction'  
import { schemaExemplo } from './schemas'  
import repositorioEntidade from '@modules/meu-modulo/repositories/entidade'

import type { ManageRequestResponse, ManageRequestBody } from '@core/middlewares/manageRequest/types'  
import type { ExemploRequest, ExemploResponse } from './types'

export const criarExemplo = defineAction(  
  {  
    method: 'post',  
    path: '/meu-modulo/v1/entidades/create',  
    summary: 'Criar nova entidade',  
    tags: ['Meu Módulo - Entidades'],  
    authenticate: true,  
    responses: {  
      200: { description: 'Sucesso', schema: schemaExemplo }  
    }  
  },  
  async ({ ids, data, manageError }: ManageRequestBody<ExemploRequest>): ManageRequestResponse<ExemploResponse> => {  
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const entidade = await repositorioEntidade.create(data)

    if (!entidade) return manageError({ code: 'conflict' })

    return entidade  
  },  
  { body: schemaExemplo }  
)
```

#### **3\. Schemas Zod + OpenAPI (actions/entidade/schemas.ts)**

Toda validação e documentação deve ser feita via Zod com o plugin @asteasolutions/zod-to-openapi.

```ts
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'  
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@core/factories/pagination/schemas'  
import { createFilterQuerySchema } from '@core/factories/filters/schemas'

import type { FilterConfig } from '@core/factories/filters/types'

extendZodWithOpenApi(z)

export const entidadeFiltersConfig: FilterConfig = {  
  partial: ['nome', 'descricao'],  
  exact: ['status', 'id']  
}

export const entidadeSchema = z.object({  
  id: z.string().openapi({ example: 'chave-unica-firebase' }),  
  nome: z.string().min(1).openapi({ example: 'Nome Exemplo' })  
}).openapi('EntidadeResponse')

export const criarEntidadeSchema = z.object({  
  nome: z.string().min(1).openapi({ example: 'Nome Exemplo' })  
}).openapi('CriarEntidade')

export const listEntidadesQuerySchema = z.object({  
  status: z.string().optional()  
}).merge(paginationQuerySchema).merge(createFilterQuerySchema(entidadeFiltersConfig)).openapi('ListEntidadesQuery')

export const listEntidadesResponseSchema = createPaginatedSchema(entidadeSchema, 'ListEntidadesResponse')
```

#### **4\. Tipos DTOs (actions/entidade/types.ts)**

Os tipos devem ser obrigatoriamente inferidos do Zod.

```ts
import { listEntidadesQuerySchema, listEntidadesResponseSchema, criarEntidadeSchema, entidadeSchema } from './schemas'

import type { z } from 'zod'

export type CriarEntidadeRequest = { body: z.infer<typeof criarEntidadeSchema> }

export type ListEntidadesRequest = { query: z.infer<typeof listEntidadesQuerySchema> }

export type EntidadeResponse = z.infer<typeof entidadeSchema>

export type ListEntidadesResponse = z.infer<typeof listEntidadesResponseSchema>
```

#### **5\. Repositórios (repositories/entidade/index.ts)**

Centraliza as interações com o Firebase Realtime Database. Utiliza filtragem em memória para compensar limitações do RTDB em consultas complexas.

```ts
import { firebaseDb } from '@core/database/connection'
import { entidadeFiltersConfig } from '@modules/meu-modulo/actions/entidade/schemas'  
import { parseFilters, applyInMemoryFilters } from '@core/factories/filters/utils'  
import { getPaginationOptions, buildPaginatedResponse } from '@core/factories/pagination/utils'

import type { FindAllEntidadeFilters, CreateEntidadePayload, EntidadeType } from './types'  
import type { PaginatedResponse } from '@core/factories/pagination/types'  

const REF_PATH = 'entidades'

const entidadeRepository = {  
  findAll: async (filters?: FindAllEntidadeFilters): Promise<PaginatedResponse<EntidadeType>> => {  
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, EntidadeType> | null

    const parsedFilters = parseFilters(filters?.filters, entidadeFiltersConfig)
    const options = getPaginationOptions(filters)

    let rows: EntidadeType[] = []

    if (data) {
      const arrayData = Object.entries(data).map(([id, item]) => ({ ...item, id }))
      rows = applyInMemoryFilters(arrayData, parsedFilters, entidadeFiltersConfig)
    }

    const count = rows.length
    const paginatedRows = rows.slice(options.offset, options.offset + options.limit)

    return buildPaginatedResponse({ rows: paginatedRows, count }, options.page, options.limit)
  },  
  create: async (data: CreateEntidadePayload): Promise<EntidadeType> => {  
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string

    const payload = { ...data, id, createdAt: new Date().toISOString() }

    await ref.set(payload)

    return payload
  }  
}

export default entidadeRepository
```

#### **6\. Rotas (routes/index.ts)**

Apenas associa os verbos e caminhos às ações exportadas.

```ts
import { Router } from 'express'

import { criarExemplo } from '@modules/meu-modulo/actions/entidade/index'

const meuModuloRouter = Router()

meuModuloRouter.post('/entidades/create', criarExemplo)

export default meuModuloRouter