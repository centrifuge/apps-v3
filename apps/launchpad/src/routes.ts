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
    route('/orders/:poolId/approve', './routes/orders/approveOrders.tsx'),
    route('/orders/:poolId/issue', './routes/orders/issueOrders.tsx'),
    route('/orders/:poolId/approveRedeem', './routes/orders/approveRedemptions.tsx'),
    route('/orders/:poolId/revokeRedeem', './routes/orders/revokeShares.tsx'),

    // Pool settings
    route('/settings/:poolId/poolAccess', './routes/settings/poolAccess.tsx'),

    // Pool Holdings
    route('/holdings/:poolId/add', './routes/holdings/add.tsx'),
  ]),
  route('*', './routes/catchall.tsx'),
] satisfies RouteConfig
