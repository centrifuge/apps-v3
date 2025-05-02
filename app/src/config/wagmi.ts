import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { centrifuge } from '../centrifuge'

const chainIds = centrifuge.chains
const chains = chainIds.map((cid) => centrifuge.getChainConfig(cid))

export const wagmiConfig = createConfig({
  // @ts-expect-error expects a minimum of 1 chain, which isn't reflected in the type
  chains,
  // TODO: update/remove after adding wallet connect library
  connectors: [injected()],
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
})
