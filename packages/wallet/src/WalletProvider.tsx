import { ReactNode, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import type { AppKitNetwork } from '@reown/appkit/networks'

export interface WalletProviderProps {
  projectId: string
  networks: AppKitNetwork[]
  children: ReactNode
}

export const WalletProvider = ({ projectId, networks, children }: WalletProviderProps) => {
  if (networks.length === 0) {
    throw new Error('Networks array cannot be empty')
  }

  const wagmiAdapter = useMemo(() => {
    return new WagmiAdapter({
      networks,
      projectId,
      connectors: [injected()],
      transports: Object.fromEntries(networks.map((chain) => [chain.id, http()])),
    })
  }, [projectId, networks])

  useMemo(() => {
    createAppKit({
      adapters: [wagmiAdapter],
      networks: networks as [AppKitNetwork, ...AppKitNetwork[]],
      projectId,
      features: { email: false, socials: false, swaps: false, send: false },
      themeMode: 'light',
    })
  }, [wagmiAdapter, projectId, networks])

  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
}
