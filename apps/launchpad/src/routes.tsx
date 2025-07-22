import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import Tokenizations from '@routes/Tokenizations'
import Investors from '@routes/Investors'
import Account from '@routes/Account'
import NavPage from '@routes/NavPage'
import ApproveOrders from '@routes/orders/ApproveOrders'
import IssueOrders from '@routes/orders/IssueOrders'
import ApproveRedemptions from '@routes/orders/ApproveRedemptions'
import RevokeShares from '@routes/orders/RevokeShares'
import PoolAccess from '@routes/settings/PoolAccess'
import NotFound from '@routes/NotFound'
import HeaderLayout from '@layouts/HeaderLayout'
import AddHolding from '@routes/holdings/AddHolding'
import DepositHolding from '@routes/holdings/DepositHolding'
import WithdrawHolding from '@routes/holdings/WithdrawHolding'
import Vaults from '@routes/Vaults'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <HeaderLayout />,
        children: [
          { index: true, element: <Tokenizations />, handle: { hasSettings: false, hasTabs: true } },
          { path: 'investors', element: <Investors />, handle: { hasSettings: false, hasTabs: true } },
          { path: 'account/:poolId', element: <Account />, handle: { hasSettings: false, hasTabs: true } },
          { path: 'nav/:shareClassId/:poolId', element: <NavPage />, handle: { hasSettings: false, hasTabs: false } },
          { path: 'orders/:poolId/approve', element: <ApproveOrders />, handle: { hasSettings: false, hasTabs: true } },
          { path: 'orders/:poolId/issue', element: <IssueOrders />, handle: { hasSettings: false, hasTabs: true } },
          {
            path: 'orders/:poolId/approveRedeem',
            element: <ApproveRedemptions />,
            handle: { hasSettings: false, hasTabs: true },
          },
          {
            path: 'orders/:poolId/revokeRedeem',
            element: <RevokeShares />,
            handle: { hasSettings: false, hasTabs: true },
          },
          {
            path: 'settings/:poolId/poolAccess',
            element: <PoolAccess />,
            handle: { hasSettings: false, hasTabs: false },
          },
          { path: 'holdings/:poolId/add', element: <AddHolding />, handle: { hasSettings: false, hasTabs: true } },
          {
            path: 'holdings/:poolId/deposit/:holdingId',
            element: <DepositHolding />,
            handle: { hasSettings: false, hasTabs: true },
          },
          {
            path: 'holdings/:poolId/withdraw/:holdingId',
            element: <WithdrawHolding />,
            handle: { hasSettings: false, hasTabs: true },
          },
          { path: 'vaults/:poolId', element: <Vaults />, handle: { hasSettings: false, hasTabs: false } },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
