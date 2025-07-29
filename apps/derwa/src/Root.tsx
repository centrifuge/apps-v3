import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Centrifuge from '@centrifuge/sdk'
import { CentrifugeProvider, DebugFlags, TransactionProvider } from '@centrifuge/shared'
import { ChakraCentrifugeProvider, ChakraCentrifugeProviderProps, LoadingProvider } from '@centrifuge/ui'
import { WalletProvider } from '@centrifuge/wallet'
import { PoolsProvider } from '@contexts/usePoolsContext'
import { VaultsProvider } from '@contexts/useVaultsContext'

const config = {
  themeKey: 'light' as ChakraCentrifugeProviderProps['themeKey'],
}

const queryClient = new QueryClient()

export default function Root() {
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
      new Centrifuge({
        environment: import.meta.env.VITE_CENTRIFUGE_ENV,
        indexerUrl: import.meta.env.VITE_INDEXER_URL,
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
                <PoolsProvider>
                  <VaultsProvider>
                    <DebugFlags>
                      <LoadingProvider>
                        <Outlet />
                      </LoadingProvider>
                    </DebugFlags>
                  </VaultsProvider>
                </PoolsProvider>
              </TransactionProvider>
            </ChakraCentrifugeProvider>
          </WalletProvider>
        </CentrifugeProvider>
      </QueryClientProvider>
    </>
  )
}
