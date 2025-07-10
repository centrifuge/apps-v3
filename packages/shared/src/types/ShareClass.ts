import { Balance, Pool, Price, ShareClass, ShareClassId } from '@centrifuge/sdk'

export type ShareClassWithDetails = {
  details: {
    id: ShareClassId
    name: string
    nav: Balance
    pricePerShare: Price
    symbol: string
    totalIssuance: Balance
  }
  shareClass: ShareClass
}
