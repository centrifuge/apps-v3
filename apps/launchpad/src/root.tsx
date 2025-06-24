import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { WalletProvider } from '@centrifuge/wallet'
import { ChakraCentrifugeProvider, ChakraCentrifugeProviderProps } from '@centrifuge/ui'
import { centrifuge, networks } from './centrifuge'
import { CentrifugeProvider, TransactionProvider } from '@centrifuge/shared'

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
    <CentrifugeProvider client={centrifuge}>
      <TransactionProvider>
        <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={networks}>
          <ChakraCentrifugeProvider themeKey={config.themeKey}>
            <Outlet />
          </ChakraCentrifugeProvider>
        </WalletProvider>
      </TransactionProvider>
    </CentrifugeProvider>
  )
}
