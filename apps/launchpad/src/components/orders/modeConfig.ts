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
      approveAssetAmount: convertBalance(asset.approveAmount, decimals),
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveDepositsAndIssueShares(assets),
  },
  issue: {
    headingText: 'Issue Shares',
    buttonText: 'Issue',
    mapAssets: (asset: any, decimals: number) => ({
      assetId: asset.assetId,
      issuePricePerShare: new Price(convertBalance(asset.issuePricePerShare, decimals).toString()),
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
    mapAssets: (asset: any, decimals: number) => ({
      assetId: asset.assetId,
      revokePricePerShare: new Price(convertBalance(asset.revokePricePerShare, decimals).toString()),
    }),
    executeTransaction: (shareClass: any, assets: any[]) => shareClass.approveRedeemsAndRevokeShares(assets),
  },
}
