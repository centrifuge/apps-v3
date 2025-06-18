import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'
import { config } from './src/config'

export default defineConfig({
  root: 'src',
  plugins: [
    react(),
    tsconfigPaths(),
    createHtmlPlugin({
      inject: {
        data: {
          APP_TITLE: config.name,
          FAVICON: config.logoUrl,
        },
      },
    }),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
})
