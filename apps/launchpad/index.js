export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname

    const isAsset = pathname.includes('.') || pathname.startsWith('/assets/')

    if (!isAsset) {
      const indexRequest = new Request(new URL('/index.html', request.url), request)
      return env.ASSETS.fetch(indexRequest)
    }

    return env.ASSETS.fetch(request)
  },
}
