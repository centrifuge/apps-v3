import { type RouteConfig, layout, index, route } from '@react-router/dev/routes'

export default [
  layout('./components/HeaderLayout.tsx', [
    index('./routes/index.tsx'),
    route('/investors', './routes/investors.tsx'),
    route('/account/:id', './routes/account.tsx'),
  ]),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
