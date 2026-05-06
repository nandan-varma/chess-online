import { defineConfig } from '@tanstack/router-cli'

export default defineConfig({
  routesDir: './src/app',
  generatedRouteTree: './src/routeTree.gen.ts',
})
