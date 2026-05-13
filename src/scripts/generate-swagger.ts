import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import express from 'express'

import registerGlobalRoutes from '@core/routes/index'
import { generateDocs } from '@core/docs/generator'

const generateSwaggerSpec = (): void => {
  const app = express()

  registerGlobalRoutes(app)

  const spec = generateDocs()
  const packageJsonPath = resolve(process.cwd(), 'package.json')
  const packageContent = readFileSync(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageContent) as { name?: string; version?: string }
  const packageName = packageJson.name ?? 'api'
  const version = packageJson.version ?? '1.0.0'
  const docsDir = resolve(process.cwd(), 'cache', 'docs')

  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true })
  }

  const filePath = resolve(docsDir, `${packageName}-${version}-swagger.json`)

  writeFileSync(filePath, JSON.stringify(spec, null, 2))
}

generateSwaggerSpec()