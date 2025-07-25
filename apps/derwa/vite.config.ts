import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'

export default defineConfig(() => {
  const envDir = path.resolve(__dirname, '../../.env-config')
  return {
    envDir,
    plugins: [
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            // TODO: should come from config, currently is not working because the way our tsconfig is configured
            APP_TITLE: 'Centrifuge Derwa',
            FAVICON: '/',
          },
        },
      }),
    ],
    server: {
      port: 3003,
    },
    build: {
      outDir: 'dist',
    },
  }
})
