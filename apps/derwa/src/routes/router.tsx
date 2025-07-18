import { createBrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@centrifuge/ui'
import MainLayout from '@layouts/MainLayout'
import PoolLayout from '@layouts/PoolLayout'
import { HomeRoute, PoolRoute, RootRoute } from '@routes/routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ErrorBoundary>
                <HomeRoute />
              </ErrorBoundary>
            ),
          },
          {
            element: <PoolLayout />,
            children: [{ path: 'pool/:poolId', element: <PoolRoute /> }],
          },
        ],
      },
    ],
  },
])
