import { createRequestHandler } from 'react-router'

const handler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.VITE_CENTRIFUGE_ENV
)

export default {
  async fetch(request, env, ctx) {
    return handler(request, {
      // pass through Cloudflare env + ctx for things like Durable Objects, KV, etc.
      cloudflare: { env, ctx },
    })
  },
}
