import { defineConfig } from '@tanstack/router-cli'

export default defineConfig({
  routesDir: './src/routes',
  generatedRouteTree: './src/routeTree.gen.ts',
})
