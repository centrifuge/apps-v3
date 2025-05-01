import { FabricProvider } from '@centrifuge/fabric'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Head } from './components/Head'
import { TransactionProvider } from './components/Transactions/TransactionsProvider'
import { TransactionToasts } from './components/Transactions/TransactionToasts'
import { config } from './config'
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
        <TransactionProvider>
          <TransactionToasts />
          <RouterProvider router={router} />
        </TransactionProvider>
      </FabricProvider>
    </>
  )
}

export default Root
