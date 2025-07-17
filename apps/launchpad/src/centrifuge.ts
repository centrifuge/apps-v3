import Centrifuge from '@centrifuge/sdk'

export const centrifuge = new Centrifuge({
  environment: import.meta.env.VITE_CENTRIFUGE_ENV,
  indexerUrl: import.meta.env.VITE_INDEXER_URL,
})

export const networks = centrifuge.chains.map((cid) => centrifuge.getChainConfig(cid))
