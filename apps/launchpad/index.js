export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname

    // A simple way to check if the request is for a static file.
    // This checks for a file extension in the last part of the path.
    const isAsset = pathname.split('/').pop().includes('.')

    // If the request is NOT for an asset, it's a client-side route.
    // In that case, we serve the main index.html file and let
    // React Router handle it in the browser.
    if (!isAsset) {
      // Create a new request that points to the root index.html
      const indexRequest = new Request(new URL('/index.html', request.url), request)
      return env.ASSETS.fetch(indexRequest)
    }

    // Otherwise, the request is for an asset (e.g., /main.css).
    // Let Cloudflare's asset serving handle it directly.
    return env.ASSETS.fetch(request)
  },
}
