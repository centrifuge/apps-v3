export function ipfsToHttp(ipfsUrl: string, gateway = 'https://ipfs.io'): string {
  if (!ipfsUrl) {
    return ''
  }
  const path = ipfsUrl.replace(/^ipfs:\/\//, '').replace(/^\/+/, '')
  return `${gateway}/ipfs/${path}`
}
