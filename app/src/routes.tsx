import { Navigate } from 'react-router-dom'
import { RouteObject } from "react-router-dom";
import { LayoutBase } from './components/LayoutBase'
import './Root.css'
import { AboutPage } from './pages/About'
import { NotFoundPage } from './pages/NotFound'
import { HomePage } from './pages/Home';

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
        path: '/pools/*',
        element: <HomePage />,
        handle: { component: HomePage },
      },
      {
        path: '/dashboard/*',
        element: <AboutPage />,
        handle: { component: AboutPage },
      },
      { path: '*', element: <NotFoundPage />, handle: { component: NotFoundPage } },
    ],
    errorElement: <NotFoundPage />,
  },
];
