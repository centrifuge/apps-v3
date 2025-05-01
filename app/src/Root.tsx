import { FabricProvider } from '@centrifuge/fabric'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { Head } from './components/Head'
import { TransactionProvider } from './components/Transactions/TransactionsProvider'
import { TransactionToasts } from './components/Transactions/TransactionToasts'
import { config } from './config'
import { wagmiConfig } from './config/wagmi'
import { routes } from './routes'

const router = createHashRouter(routes)

export function Root() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [theme, setTheme] = React.useState(config.themes.light)
  return (
    <>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <FabricProvider theme={theme}>
        <WagmiProvider config={wagmiConfig}>
          <TransactionProvider>
            <TransactionToasts />
            <RouterProvider router={router} />
          </TransactionProvider>
        </WagmiProvider>
      </FabricProvider>
    </>
  )
}

export default Root
