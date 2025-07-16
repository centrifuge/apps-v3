import Centrifuge from '@centrifuge/sdk'

export const centrifuge = new Centrifuge({
  environment: 'testnet',
  rpcUrls: { 11155111: `https://eth-sepolia.g.alchemy.com/v2/KNR-1LZhNqWOxZS2AN8AFeaiESBV10qZ` },
  indexerUrl: 'https://api-v3-hitz.marble.live/graphql',
})

export const networks = centrifuge.chains.map((cid) => centrifuge.getChainConfig(cid))
