import { ReactNode, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { http } from 'wagmi'
import { injected } from 'wagmi/connectors'

export interface AppKitProviderProps {
  projectId: string
  // TODO: fix this, should come from sdk
  centrifugeConfig: any
  children: ReactNode
}

export const AppKitProvider = ({ projectId, centrifugeConfig, children }: AppKitProviderProps) => {
  const wagmiAdapter = useMemo(() => {
    const chainIds = centrifugeConfig.chains
    const chains = chainIds.map((cid: string) => centrifugeConfig.getChainConfig(cid))

    if (!chains.length) throw new Error('Networks array cannot be empty')

    const typedChains = chains as unknown as [AppKitNetwork, ...AppKitNetwork[]]

    return new WagmiAdapter({
      networks: typedChains,
      projectId,
      connectors: [injected()],
      transports: Object.fromEntries(typedChains.map((chain) => [chain.id, http()])),
    })
  }, [projectId, centrifugeConfig])

  useMemo(() => {
    createAppKit({
      adapters: [wagmiAdapter],
      networks: wagmiAdapter.networks,
      projectId,
      features: { email: false, socials: false },
    })
  }, [wagmiAdapter, projectId])

  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
}
