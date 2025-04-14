import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { FabricProvider } from '@centrifuge/fabric'
import { Head } from './components/Head'
import { config } from './config'
import { routes } from './routes'

const router = createHashRouter(routes)

export function Root() {
  return (
    <>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <FabricProvider theme={config.themes.light}>
          <RouterProvider router={router} />
      </FabricProvider>
    </>
  )
}

export default Root
