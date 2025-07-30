import { Pool, Vault } from '@centrifuge/sdk'

export type CurrencyDetails = {
  name: string
  symbol: string
  decimals: number
}

export type PoolDetails = Awaited<ReturnType<typeof Pool.prototype.details>> & {
  metadata?: {
    pool: {
      expenseRatio: number
    }
  } | null
}
export type VaultDetails = Awaited<ReturnType<typeof Vault.prototype.details>>
