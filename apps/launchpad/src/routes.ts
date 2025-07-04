import { type RouteConfig, layout, index, route } from '@react-router/dev/routes'

export default [
  layout('./layouts/HeaderLayout.tsx', [
    index('./routes/index.tsx'),

    // Investors
    route('/investors', './routes/investors.tsx'),

    // Account
    route('/account/:poolId', './routes/account.tsx'),

    // Nav
    route('/nav/:shareClassId/:poolId', './routes/nav.tsx'),

    // Orders
    route('/orders/:poolId/approve', './routes/orders/approve.tsx'),
    route('/orders/:poolId/issue', './routes/orders/issue.tsx'),
    route('/orders/:poolId/approveRedeem', './routes/orders/approveRedeem.tsx'),
    route('/orders/:poolId/revokeRedeem', './routes/orders/revoke.tsx'),

    // Pool settings
    route('/settings/:poolId/poolAccess', './routes/settings/poolAccess.tsx'),
  ]),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
