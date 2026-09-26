import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
// @ts-expect-error Módulo JS del servidor sin tipos TypeScript
import { createApiApp } from './server/app.js'

// La API de RemodelaUSA se sirve dentro del mismo servidor de desarrollo:
// las rutas /api/* responden desde server/app.js (base de datos SQLite local).
function remodelausaApi(): Plugin {
  return {
    name: 'remodelausa-api',
    configureServer(server) {
      // La app Express es compatible con el middleware connect de Vite
      server.middlewares.use(createApiApp() as never)
    },
  } as Plugin
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), remodelausaApi()],
  server: {
    port: 7100,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
