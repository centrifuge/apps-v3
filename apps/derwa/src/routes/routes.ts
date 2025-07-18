import { lazy } from 'react'

export const RootRoute = lazy(() => import('../Root'))
export const HomeRoute = lazy(() => import('@pages/Home'))
export const PoolRoute = lazy(() => import('@pages/PoolPage'))
