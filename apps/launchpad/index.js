// We are building a static site using wokers
// more info https://developers.cloudflare.com/workers/static-assets/

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },
}
