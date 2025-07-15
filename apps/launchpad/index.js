import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/assets/*', serveStatic({ root: './dist' }))

// This rule is the catch-all. For any other path, it serves the main index.html file.
// This allows client-side React Router to work.
app.get('*', serveStatic({ path: './dist/index.html' }))

export default app
