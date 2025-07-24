import { Price } from '@centrifuge/sdk'
import { Row } from './tableColumnsConfig'
import { OrderMode } from './modeConfig'
import { Asset } from '@centrifuge/shared'

const createApproveFormRow = (row: Row) => ({
  uniqueId: row.id,
  assetId: row.assetId,
  approveAmount: row.amount.toFloat().toString(),
  assetDecimals: row.asset?.decimals,
})

const createRedeemFormRow = (row: Row) => ({
  uniqueId: row.id,
  assetId: row.assetId,
  approveShareAmount: row.amount.toFloat().toString(),
})

const createIssueFormRow = (row: Row, pricePerShare: Price) => ({
  uniqueId: row.id,
  assetId: row.assetId,
  issuePricePerShare: pricePerShare.toFloat().toString(),
})

const createRevokeFormRow = (row: Row, pricePerShare: Price) => ({
  uniqueId: row.id,
  assetId: row.assetId,
  revokePricePerShare: pricePerShare.toFloat().toString(),
})

export const tableDataConfig: Record<
  OrderMode,
  {
    getRows: (item: any, holding?: Asset) => Row[]
    createFormRow: (row: Row, pricePerShare: Price) => any
  }
> = {
  // --- APPROVE ---
  approve: {
    getRows: (item, holding) => {
      if (!item.pendingDeposit || item.pendingDeposit.isZero()) return []
      return [
        {
          id: `${item.chainId}-${item.assetId.toString()}`,
          chainId: item.chainId.toString(),
          amount: item.pendingDeposit,
          asset: holding,
          assetId: item.assetId,
        },
      ]
    },
    createFormRow: createApproveFormRow,
  },

  // --- REDEEM MODE ---
  redeem: {
    getRows: (item, holding) => {
      if (!item.pendingRedeem || item.pendingRedeem.isZero()) return []
      return [
        {
          id: `${item.chainId}-${item.assetId.toString()}`,
          chainId: item.chainId.toString(),
          amount: item.pendingRedeem,
          asset: holding,
          assetId: item.assetId,
        },
      ]
    },
    createFormRow: createRedeemFormRow,
  },

  // --- ISSUE MODE ---
  issue: {
    getRows: (item, holding) => {
      return item.pendingIssuances.map((issuance: any, idx: number) => ({
        id: `${item.chainId}-${issuance.epoch}-${idx}`,
        chainId: item.chainId.toString(),
        amount: issuance.amount,
        approvedAt: issuance.approvedAt,
        epoch: issuance.epoch,
        asset: holding,
        assetId: item.assetId,
      }))
    },
    createFormRow: createIssueFormRow,
  },

  // --- REVOKE MODE ---
  revoke: {
    getRows: (item, holding) => {
      return item.pendingRevocations.map((revocation: any, idx: number) => ({
        id: `${item.chainId}-${revocation.epoch}-${idx}`,
        chainId: item.chainId.toString(),
        amount: revocation.amount,
        approvedAt: revocation.approvedAt,
        epoch: revocation.epoch,
        asset: holding,
        assetId: item.assetId,
      }))
    },
    createFormRow: createRevokeFormRow,
  },
}
