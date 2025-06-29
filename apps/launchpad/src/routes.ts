import { type RouteConfig, layout, index, route } from '@react-router/dev/routes'

export default [
  layout('./components/HeaderLayout.tsx', [
    index('./routes/index.tsx'),

    // Investors page
    route('/investors', './routes/investors.tsx'),

    // Account page
    route('/account/:poolId', './routes/account.tsx'),

    // Orders page
    route('/orders/:poolId/approve', './routes/orders/approve.tsx'),
    route('/orders/:poolId/issue', './routes/orders/issue.tsx'),
    route('/orders/:poolId/approveRedeem', './routes/orders/approveRedeem.tsx'),
    route('/orders/:poolId/revokeRedeem', './routes/orders/revoke.tsx'),
  ]),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
