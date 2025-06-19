import { Navigate } from 'react-router-dom'
import { RouteObject } from 'react-router-dom'
import { LayoutBase } from './components/LayoutBase'
import { NotFoundPage } from './pages/NotFound'
import PoolsPage from './pages/Pools'
import PortfolioPage from './pages/Portfolio'
import PrimePage from './pages/Prime'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutBase />,
    children: [
      {
        path: '/',
        element: <Navigate to="/pools" replace />,
      },
      {
        path: '/pools',
        element: <PoolsPage />,
        handle: { component: PoolsPage },
      },
      { path: '/portfolio', element: <PortfolioPage />, handle: { component: PortfolioPage } },
      { path: '/prime', element: <PrimePage />, handle: { component: PrimePage } },
      { path: '*', element: <NotFoundPage />, handle: { component: NotFoundPage } },
    ],
    errorElement: <NotFoundPage />,
  },
]
