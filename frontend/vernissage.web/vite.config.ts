import { execSync } from 'node:child_process'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Branch the frontend is built from. CI (GitHub Actions / Azure SWA) provides it
// via VITE_APP_BRANCH or GITHUB_REF_NAME; otherwise fall back to the local git
// branch, then to "unknown".
function resolveBranch(): string {
  const fromEnv =
    process.env.VITE_APP_BRANCH || process.env.GITHUB_REF_NAME || process.env.BRANCH
  if (fromEnv) return fromEnv
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __APP_BRANCH__: JSON.stringify(resolveBranch()),
  },
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
})
