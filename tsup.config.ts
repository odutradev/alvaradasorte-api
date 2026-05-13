import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/core/server.ts'],
  target: 'node18',
  format: ['cjs'],
  splitting: false,
  sourcemap: !!options.watch,
  keepNames: true,
  minify: !options.watch,
  clean: true,
  onSuccess: options.watch ? 'node dist/server.js' : undefined
}))
