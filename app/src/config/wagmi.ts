import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { centrifuge } from '../centrifuge'

const chainIds = centrifuge.chains
const chainConfigs = chainIds.map((cid) => centrifuge.getChainConfig(cid))

export const wagmiConfig = createConfig({
  // @ts-expect-error expects a minimum of 1 chain, which isn't reflected in the type
  chains: chainConfigs,
  connectors: [injected()],
  transports: Object.fromEntries(chainConfigs.map((chain) => [chain.id, http()])),
})
