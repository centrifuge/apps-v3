import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(() => {
  return {
    envDir: '../.env-config',
    plugins: [
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        inject: {
          // TODO. should come from config, currently is not working because the way our tsconfig is configured
          data: {
            APP_TITLE: 'Centrifuge Permissionless',
            FAVICON: '/',
          },
        },
      }),
    ],
    server: {
      port: 3003,
    },
  }
})
