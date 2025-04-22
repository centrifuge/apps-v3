import { Navigate } from 'react-router-dom'
import { RouteObject } from 'react-router-dom'
import { LayoutBase } from './components/LayoutBase'
import { AboutPage } from './pages/About'
import { NotFoundPage } from './pages/NotFound'
import PoolsPage from './pages/Pools'
import PortfolioPage from './pages/Portfolio'

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
      {
        path: '/dashboard/*',
        element: <AboutPage />,
        handle: { component: AboutPage },
      },
      { path: '*', element: <NotFoundPage />, handle: { component: NotFoundPage } },
    ],
    errorElement: <NotFoundPage />,
  },
]
