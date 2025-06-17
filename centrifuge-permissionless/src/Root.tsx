import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { App } from './App'
import { wagmiAdapter } from './config/wallet'

const queryClient = new QueryClient()

export function Root() {
  return (
    <>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}
