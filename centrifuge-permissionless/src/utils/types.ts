import { Balance, PoolId, ShareClass, ShareClassId, type PoolMetadata } from '@centrifuge/sdk'

export type CurrencyDetails = {
  name: string
  symbol: string
  decimals: number
}

export type PoolDetails = {
  metadata: PoolMetadata | null
  currency: CurrencyDetails | null
  id: PoolId
  shareClasses: Array<{
    shareClass: ShareClass
    details: {
      id: ShareClassId
      name: string
      symbol: string
      totalIssuance: Balance
      navPerShare: Balance
    }
  }>
}
