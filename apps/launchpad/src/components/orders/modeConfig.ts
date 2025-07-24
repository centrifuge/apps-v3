import { Balance, Price } from '@centrifuge/sdk'

export type OrderMode = 'approve' | 'issue' | 'redeem' | 'revoke'

const convertBalance = (balance: string, decimals: number) => {
  return Balance.fromFloat(balance, decimals)
}

export const modeConfig = {
  approve: {
    headingText: 'Approve Deposits',
    buttonText: 'Approve',
    mapAssets: (asset: any, decimals: number) => ({
      assetId: asset.assetId,
      approveAssetAmount: convertBalance(asset.approveAssetAmount, decimals),
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveDepositsAndIssueShares(assets),
  },
  issue: {
    headingText: 'Issue Shares',
    buttonText: 'Issue',
    mapAssets: (asset: any) => ({
      assetId: asset.assetId,
      // Price is always 18 decimals
      issuePricePerShare: new Price(convertBalance(asset.issuePricePerShare, 18).toString()),
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveDepositsAndIssueShares(assets),
  },
  redeem: {
    headingText: 'Redeem Shares',
    buttonText: 'Redeem',
    mapAssets: (asset: any, decimals: number) => ({
      assetId: asset.assetId,
      approveShareAmount: convertBalance(asset.approveShareAmount, decimals),
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveRedeemsAndRevokeShares(assets),
  },
  revoke: {
    headingText: 'Revoke Shares',
    buttonText: 'Revoke',
    mapAssets: (asset: any) => ({
      assetId: asset.assetId,
      revokePricePerShare: new Price(convertBalance(asset.revokePricePerShare, 18).toString()),
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveRedeemsAndRevokeShares(assets),
  },
}
