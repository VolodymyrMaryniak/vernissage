import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://vernissage-api-dev-a7a4dqf2dacgfuhd.francecentral-01.azurewebsites.net',
        changeOrigin: true,
      },
    },
  },
})
