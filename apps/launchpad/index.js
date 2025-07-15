export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname

    const isAsset = pathname.split('/').pop().includes('.')

    if (!isAsset) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request))
    }

    return env.ASSETS.fetch(request)
  },
}
