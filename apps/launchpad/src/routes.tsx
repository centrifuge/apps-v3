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

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <HeaderLayout />,
        children: [
          { index: true, element: <Tokenizations /> },
          { path: 'investors', element: <Investors /> },
          { path: 'account/:poolId', element: <Account /> },
          { path: 'nav/:shareClassId/:poolId', element: <NavPage /> },
          { path: 'orders/:poolId/approve', element: <ApproveOrders /> },
          { path: 'orders/:poolId/issue', element: <IssueOrders /> },
          { path: 'orders/:poolId/approveRedeem', element: <ApproveRedemptions /> },
          { path: 'orders/:poolId/revokeRedeem', element: <RevokeShares /> },
          { path: 'settings/:poolId/poolAccess', element: <PoolAccess /> },
          { path: 'holdings/:poolId/add', element: <AddHolding /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
