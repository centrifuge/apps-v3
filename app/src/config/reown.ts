import { createAppKit } from '@reown/appkit/react'
import {AppKitNetwork} from '@reown/appkit/networks';
import { http } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { centrifuge } from '../centrifuge'
import { injected } from 'wagmi/connectors'

// 1. Get projectId from https://cloud.reown.com
const projectId = 'YOUR_PROJECT_ID'

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const chainIds = centrifuge.chains
const chains = chainIds.map((cid) => centrifuge.getChainConfig(cid)) satisfies AppKitNetwork[]
// force the centrifuge chains to be of type AppKitNetwork so that we don't have to import the chains individually and specifically (and reown ts doesn't complain)
if (chains.length === 0) {
  throw new Error("Networks array cannot be empty");
}
const typedChains = chains as unknown as [AppKitNetwork, ...AppKitNetwork[]];

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: typedChains,
  projectId,
  connectors: [injected()],
  transports: Object.fromEntries(typedChains.map((chain) => [chain.id, http()])),
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: typedChains,
  projectId,
  metadata
})
