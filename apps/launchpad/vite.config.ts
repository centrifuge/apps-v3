import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig(() => {
  const envDir = path.resolve(__dirname, '../../.env-config')
  return {
    envDir,
    plugins: [reactRouter(), tsconfigPaths(), cloudflare()],
    server: {
      port: 3004,
    },
    build: {
      outDir: 'dist',
    },
  }
})
