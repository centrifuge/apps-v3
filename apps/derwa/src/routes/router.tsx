import { createBrowserRouter } from 'react-router-dom'
import { LoadingBoundary } from '@centrifuge/ui'
import MainLayout from '@layouts/MainLayout'
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
              <LoadingBoundary>
                <HomeRoute />
              </LoadingBoundary>
            ),
          },
          {
            path: 'pool/:poolId',
            element: (
              <LoadingBoundary>
                <PoolRoute />
              </LoadingBoundary>
            ),
          },
        ],
      },
    ],
  },
])
