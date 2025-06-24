import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'

export default defineConfig(() => {
  return {
    envDir: '../.env-config',
    plugins: [reactRouter()],
    server: {
      port: 3004,
    },
  }
})
