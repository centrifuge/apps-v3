import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { FabricProvider } from '@centrifuge/fabric'
import { Head } from './components/Head'
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
          <RouterProvider router={router} />
      </FabricProvider>
    </>
  )
}

export default Root
