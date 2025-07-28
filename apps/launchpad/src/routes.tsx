import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import Sidebar from './layouts/Sidebar'
import Tokenizations from '@routes/Tokenizations'
import Investors from '@routes/Investors'
import Account from '@routes/Account'
import NavPage from '@routes/NavPage'
import ApproveOrders from '@routes/orders/ApproveOrders'
import IssueOrders from '@routes/orders/IssueOrders'
import ApproveRedemptions from '@routes/orders/ApproveRedemptions'
import PoolAccess from '@routes/settings/PoolAccess'
import PoolStructure from '@routes/settings/PoolStructure'
import NotFound from '@routes/NotFound'
import AddHolding from '@routes/holdings/AddHolding'
import DepositHolding from '@routes/holdings/DepositHolding'
import WithdrawHolding from '@routes/holdings/WithdrawHolding'
import Vaults from '@routes/Vaults'
import UpdateMetadata from '@routes/UpdateMetadata'
import RevokeShares from '@routes/orders/RevokeShares'
import Holdings from '@routes/holdings/Holdings'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <Sidebar />,
        children: [
          // Public pool list
          { index: true, element: <Tokenizations /> },

          // All dynamic routes under /:poolId/:shareClassId
          {
            path: 'pool/:poolId/:shareClassId/*',
            children: [
              { index: true, element: <Tokenizations /> },

              { path: 'investors', element: <Investors /> },
              { path: 'account', element: <Account /> },
              { path: 'nav', element: <NavPage /> },

              // Orders
              { path: 'orders/approve', element: <ApproveOrders /> },
              { path: 'orders/issue', element: <IssueOrders /> },
              { path: 'orders/approveRedeem', element: <ApproveRedemptions /> },
              { path: 'orders/revokeRedeem', element: <RevokeShares /> },

              // Settings
              { path: 'settings/poolAccess', element: <PoolAccess /> },
              { path: 'settings/poolStructure', element: <PoolStructure /> },

              // Holdings
              { path: 'holdings', element: <Holdings /> },
              { path: 'holdings/deposit/:holdingId', element: <DepositHolding /> },
              { path: 'holdings/withdraw/:holdingId', element: <WithdrawHolding /> },

              // Vaults & Metadata
              { path: 'vaults', element: <Vaults /> },
              { path: 'updateMetadata', element: <UpdateMetadata /> },

              // fallback for truly unknown nested paths
              { path: '*', element: <NotFound /> },
            ],
          },

          // Global 404
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
