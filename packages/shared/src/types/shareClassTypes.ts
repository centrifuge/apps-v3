import { AssetId, Balance, ShareClass } from '@centrifuge/sdk'

export type ShareClassWithDetails = {
  shareClass: ShareClass
  details: Awaited<ReturnType<typeof ShareClass.prototype.details>>
}

export type PendingAmount = {
  depositEpoch: number
  redeemEpoch: number
  issueEpoch: number
  revokeEpoch: number
  pendingDeposit: Balance
  pendingRedeem: Balance
  approvedDeposit: Balance
  approvedRedeem: Balance
  assetId: AssetId
  chainId: number
}

export type Holdings = Awaited<ReturnType<typeof ShareClass.prototype.balances>>
