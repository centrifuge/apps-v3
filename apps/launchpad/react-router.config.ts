import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src',
  ssr: true,
  buildDirectory: 'dist',
  future: {
    // To get server side rendering in cloudflare workers
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
