import { defineConfig, type UserConfig } from 'vite'
import type { InlineConfig } from 'vitest/node'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const config: UserConfig & { test: InlineConfig } = {
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://vernissage-api-dev-a7a4dqf2dacgfuhd.francecentral-01.azurewebsites.net',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
}

export default defineConfig(config)
