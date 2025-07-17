import Centrifuge from '@centrifuge/sdk'

export const centrifuge = new Centrifuge({
  environment: import.meta.env.VITE_ENVIRONMENT,
  rpcUrls: { 11155111: `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}` },
})

export const networks = centrifuge.chains.map((cid) => centrifuge.getChainConfig(cid))
