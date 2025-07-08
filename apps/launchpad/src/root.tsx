import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { WalletProvider } from '@centrifuge/wallet'
import { ChakraCentrifugeProvider, ChakraCentrifugeProviderProps } from '@centrifuge/ui'
import { centrifuge, networks } from './centrifuge'
import { CentrifugeProvider, TransactionProvider } from '@centrifuge/shared'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PoolProvider } from '@contexts/PoolProvider'
import { DebugFlags } from '@centrifuge/shared/src/components/DebugFlags'

const queryClient = new QueryClient()

const config = {
  themeKey: 'light' as ChakraCentrifugeProviderProps['themeKey'],
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Centrifuge Launchpad</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

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
