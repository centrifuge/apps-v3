import { createBalanceSchema } from '@centrifuge/forms'
import { AssetId } from '@centrifuge/sdk'
import { z } from 'zod'

export type OrderMode = 'approve' | 'issue' | 'redeem' | 'revoke'

const ApproveAsset = z.object({
  assetId: z.instanceof(AssetId),
  approveAssetAmount: createBalanceSchema(6),
})

// Price is always 18 decimals
const IssueAsset = z.object({
  assetId: z.instanceof(AssetId),
  issuePricePerShare: createBalanceSchema(18),
})

const RedeemAsset = z.object({
  assetId: z.instanceof(AssetId),
  redeemAmount: createBalanceSchema(6),
})

// Price is always 18 decimals
const RevokeAsset = z.object({
  assetId: z.instanceof(AssetId),
  revokeAmount: createBalanceSchema(18),
})

export const modeConfig = {
  approve: {
    schema: ApproveAsset,
    headingText: 'Approve Deposits',
    buttonText: 'Approve',
    mapAssets: (asset: any) => ({
      assetId: asset.assetId,
      approveAssetAmount: asset.approveAssetAmount,
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveDepositsAndIssueShares(assets),
  },
  issue: {
    schema: IssueAsset,
    headingText: 'Issue Shares',
    buttonText: 'Issue',
    mapAssets: (asset: any) => ({
      assetId: asset.assetId,
      issuePricePerShare: asset.issuePricePerShare,
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveDepositsAndIssueShares(assets),
  },
  redeem: {
    schema: RedeemAsset,
    headingText: 'Redeem Shares',
    buttonText: 'Redeem',
    mapAssets: (asset: any) => ({
      assetId: asset.assetId,
      redeemAmount: asset.redeemAmount,
    }),
    executeTransaction: (shareClass: any, assets: any[]) => console.log('redeem', assets),
  },
  revoke: {
    schema: RevokeAsset,
    headingText: 'Revoke Shares',
    buttonText: 'Revoke',
    mapAssets: (asset: any) => ({
      assetId: asset.assetId,
      revokeAmount: asset.revokeAmount,
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.revokeRedeem(assets),
  },
}
