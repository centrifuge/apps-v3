import { FabricProvider } from '@centrifuge/fabric'
import { DebugFlags, initialFlagsState } from './components/DebugFlags'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { Head } from './components/Head'
import { TransactionProvider } from './components/Transactions/TransactionsProvider'
import { TransactionToasts } from './components/Transactions/TransactionToasts'
import { config } from './config'
import { wagmiAdapter } from './config/reown'
import { routes } from './routes'

const router = createHashRouter(routes)
const queryClient = new QueryClient()

export function Root() {
  const [debugState, setDebugState] = React.useState(initialFlagsState)

  return (
    <>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <DebugFlags onChange={(state) => setDebugState(state)}>
        <FabricProvider theme={debugState.darkMode ? config.themes.dark : config.themes.light}>
          <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <TransactionProvider>
                <TransactionToasts />
                <RouterProvider router={router} />
              </TransactionProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </FabricProvider>
      </DebugFlags>
    </>
  )
}

export default Root
