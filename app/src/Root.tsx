import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { FabricProvider } from '@centrifuge/fabric'
import { DebugFlags, initialFlagsState } from './components/DebugFlags'
import { Head } from './components/Head'
import { config } from './config'
import { routes } from './routes'

const router = createHashRouter(routes)

export function Root() {
  const [debugState, setDebugState] = React.useState(initialFlagsState)

  return (
    <>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <FabricProvider theme={config.themes.light}>
        <DebugFlags onChange={(state) => setDebugState(state)}>
        <RouterProvider router={router} />
        </DebugFlags>
      </FabricProvider>
    </>
  )
}

export default Root
