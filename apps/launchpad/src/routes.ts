import { type RouteConfig, layout, index, route } from '@react-router/dev/routes'

export default [
  layout('./components/HeaderLayout.tsx', [index('./routes/index.tsx')]),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
