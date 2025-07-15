import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig(() => {
  const envDir = path.resolve(__dirname, '../../.env-config')
  return {
    envDir,
    plugins: [tsconfigPaths()],
    server: {
      port: 3004,
    },
    build: {
      outDir: 'dist',
    },
  }
})
