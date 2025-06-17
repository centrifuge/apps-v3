import { createAppKit } from '@reown/appkit/react'
import { http } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { injected } from 'wagmi/connectors'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { centrifuge } from '../centrifuge'

const projectId = import.meta.env.VITE_REOWN_APP_ID!

const chainIds = centrifuge.chains
const chains = chainIds.map((cid) => centrifuge.getChainConfig(cid)) satisfies AppKitNetwork[]
if (chains.length === 0) {
  throw new Error('Networks array cannot be empty')
}
const typedChains = chains as unknown as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  networks: typedChains,
  projectId,
  connectors: [injected()],
  transports: Object.fromEntries(typedChains.map((chain) => [chain.id, http()])),
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: typedChains,
  projectId,
  features: {
    email: false,
    socials: false,
  },
})
