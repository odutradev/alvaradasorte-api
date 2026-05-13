import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import express from 'express'

import registerGlobalRoutes from '@core/routes/index'
import { generateDocs } from '@core/docs/generator'

type SchemaProperty = {
  type?: string
  example?: unknown
  default?: unknown
  $ref?: string
  properties?: Record<string, SchemaProperty>
  items?: SchemaProperty
}

type OpenApiComponents = {
  schemas?: Record<string, SchemaProperty>
}

type RouteConfig = {
  tags?: string[]
  summary?: string
  parameters?: Array<{ in: string; name: string }>
  requestBody?: {
    content?: {
      'application/json'?: {
        schema?: SchemaProperty
      }
    }
  }
}

type CollectionItem = {
  name: string
  item?: CollectionItem[]
  request?: {
    method: string
    header: Array<{ key: string; value: string }>
    url: {
      raw: string
      host: string[]
      path: string[]
      variable?: Array<{ key: string; value: string }>
    }
    body?: {
      mode: string
      raw: string
      options: { raw: { language: string } }
    }
  }
}

const buildExampleFromSchema = (schema?: SchemaProperty, components?: OpenApiComponents): unknown => {
  if (!schema) return {}

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop() ?? ''
    const refSchema = components?.schemas?.[refName]
    
    return buildExampleFromSchema(refSchema, components)
  }

  if (schema.example !== undefined) return schema.example
  
  if (schema.default !== undefined) return schema.default

  if (schema.type === 'object' && schema.properties) {
    const obj: Record<string, unknown> = {}
    
    Object.entries(schema.properties).forEach(([key, prop]) => {
      obj[key] = buildExampleFromSchema(prop, components)
    })
    
    return obj
  }

  if (schema.type === 'array' && schema.items) {
    return [buildExampleFromSchema(schema.items, components)]
  }

  if (schema.type === 'string') return 'string'
  if (schema.type === 'number' || schema.type === 'integer') return 0
  if (schema.type === 'boolean') return true

  return null
}

const generatePostmanCollection = (): void => {
  const app = express()
  
  registerGlobalRoutes(app)
  
  const spec = generateDocs()
  const packageJsonPath = resolve(process.cwd(), 'package.json')
  const packageContent = readFileSync(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageContent) as { name?: string; version?: string }
  const packageName = packageJson.name ?? 'api'
  const version = packageJson.version ?? '1.0.0'

  const collection = {
    info: {
      name: `${packageName} v${version}`,
      description: 'Auto-generated Postman collection',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: 'http://localhost:3000/core/v1', type: 'string' },
      { key: 'token', value: '', type: 'string' }
    ],
    event: [
      {
        listen: 'prerequest',
        script: {
          type: 'text/javascript',
          exec: [
            "const token = pm.collectionVariables.get('token')",
            "if (token) {",
            "  pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + token })",
            "}"
          ]
        }
      },
      {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: [
            "if (pm.response.code === 200) {",
            "  try {",
            "    const body = pm.response.json()",
            "    if (body.token) pm.collectionVariables.set('token', body.token)",
            "  } catch (e) {}",
            "}"
          ]
        }
      }
    ],
    item: [] as CollectionItem[]
  }

  const folders: Record<string, CollectionItem> = {}

  if (spec.paths) {
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods as Record<string, RouteConfig>).forEach(([method, config]) => {
        const tag = config.tags?.[0] ?? 'Default'
        
        if (!folders[tag]) {
          folders[tag] = { name: tag, item: [] }
          collection.item.push(folders[tag])
        }

        const pathVariables = config.parameters?.filter((p) => p.in === 'path') ?? []
        const postmanRequest: CollectionItem = {
          name: config.summary ?? path,
          request: {
            method: method.toUpperCase(),
            header: [],
            url: {
              raw: `{{baseUrl}}${path.replace(/\{([^}]+)\}/g, ':$1')}`,
              host: ['{{baseUrl}}'],
              path: path.split('/').filter(Boolean).map((p: string) => p.replace(/\{([^}]+)\}/g, ':$1')),
              variable: pathVariables.map((p) => ({
                key: p.name,
                value: `{${p.name}}`
              }))
            }
          }
        }

        const jsonContent = config.requestBody?.content?.['application/json']
        
        if (jsonContent) {
          postmanRequest.request?.header.push({ key: 'Content-Type', value: 'application/json' })
          
          const payload = buildExampleFromSchema(jsonContent.schema, spec.components as OpenApiComponents)
          
          postmanRequest.request!.body = {
            mode: 'raw',
            raw: JSON.stringify(payload, null, 2),
            options: { raw: { language: 'json' } }
          }
        }

        folders[tag].item?.push(postmanRequest)
      })
    })
  }

  const docsDir = resolve(process.cwd(), 'cache', 'docs')
  
  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true })
  }
  
  const filePath = resolve(docsDir, `${packageName}-${version}.json`)
  
  writeFileSync(filePath, JSON.stringify(collection, null, 2))
  console.log(`Postman collection generated at: ${filePath}`)
}

generatePostmanCollection()