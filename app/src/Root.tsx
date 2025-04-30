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
  const [, setDebugState] = React.useState(initialFlagsState)
  const [theme, ] = React.useState(config.themes.light)
  return (
    <>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <DebugFlags onChange={(state) => setDebugState(state)}>
        <FabricProvider theme={theme}>
          <RouterProvider router={router} />
        </FabricProvider>
      </DebugFlags>
    </>
  )
}

export default Root
