import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from '@centrifuge/wallet'
import { ChakraCentrifugeProvider, ChakraCentrifugeProviderProps } from '@centrifuge/ui'
import { CentrifugeProvider, TransactionProvider } from '@centrifuge/shared'
import { PoolProvider } from '@contexts/PoolProvider'
import { DebugFlags } from '@centrifuge/shared/src/components/DebugFlags'
import { centrifuge, networks } from './centrifuge'

const queryClient = new QueryClient()
const config = { themeKey: 'light' as ChakraCentrifugeProviderProps['themeKey'] }

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <CentrifugeProvider client={centrifuge}>
        <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={networks}>
          <ChakraCentrifugeProvider themeKey={config.themeKey}>
            <TransactionProvider>
              <PoolProvider>
                <DebugFlags>
                  <Outlet />
                </DebugFlags>
              </PoolProvider>
            </TransactionProvider>
          </ChakraCentrifugeProvider>
        </WalletProvider>
      </CentrifugeProvider>
    </QueryClientProvider>
  )
}
