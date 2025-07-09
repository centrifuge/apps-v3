import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { WalletProvider } from '@centrifuge/wallet'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext'
import Centrifuge from '@centrifuge/sdk'
import { CentrifugeProvider, TransactionProvider } from '@centrifuge/shared'
import { ChakraCentrifugeProvider, ChakraCentrifugeProviderProps } from '@centrifuge/ui'
import { useMemo } from 'react'
import { DebugFlags } from '@centrifuge/shared/src/components/DebugFlags'

const config = {
  themeKey: 'light' as ChakraCentrifugeProviderProps['themeKey'],
}

const queryClient = new QueryClient()

export function Root() {
  /**
   * Initialize Centrifuge SDK with any necessary config.
   * We need to ensure it is created only once, so we must use useMemo.
   * If we don't use useMemo, it can create a new instance on every render,
   * which can lead to issues with state management and performance.
   * Be sure to always use the same instance of Centrifuge SDK throughout the app,
   * from `useCentrifuge()` set in `CentrifugeProvider`.
   */
  const centrifuge = useMemo(
    () =>
      // TODO: SETUP VITE ENV VARIABLES FOR DEPLOYMENT
      new Centrifuge({
        environment: 'testnet',
        rpcUrls: { 11155111: `https://eth-sepolia.g.alchemy.com/v2/KNR-1LZhNqWOxZS2AN8AFeaiESBV10qZ` },
      }),
    []
  )

  const networks = useMemo(() => centrifuge.chains.map((cid) => centrifuge.getChainConfig(cid)), [centrifuge])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CentrifugeProvider client={centrifuge}>
          <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={networks}>
            <ChakraCentrifugeProvider themeKey={config.themeKey}>
              <TransactionProvider>
                <SelectedPoolProvider>
                  <DebugFlags>
                    <App />
                  </DebugFlags>
                </SelectedPoolProvider>
              </TransactionProvider>
            </ChakraCentrifugeProvider>
          </WalletProvider>
        </CentrifugeProvider>
      </QueryClientProvider>
    </>
  )
}
