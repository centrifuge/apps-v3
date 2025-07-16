import Centrifuge from '@centrifuge/sdk'

export const centrifuge = new Centrifuge({
  environment: 'testnet',
})

export const networks = centrifuge.chains.map((cid) => centrifuge.getChainConfig(cid))
