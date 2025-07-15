import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig(() => {
  const envDir = path.resolve(__dirname, '../../.env-config')
  return {
    envDir,
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 3004,
    },
    build: {
      outDir: 'dist',
    },
  }
})
