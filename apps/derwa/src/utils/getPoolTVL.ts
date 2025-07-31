import { Balance } from '@centrifuge/sdk'
import { formatBalance, PoolDetails } from '@centrifuge/shared'

export function getPoolTVL(poolDetails: PoolDetails | undefined): string {
  const zeroBalance: Balance = new Balance(0n, 18)
  const poolTvlBalance =
    poolDetails?.shareClasses.reduce((acc, shareClass) => {
      const { totalIssuance, pricePerShare } = shareClass.details
      const tvl = totalIssuance.mul(pricePerShare)
      return acc.add(tvl)
    }, zeroBalance) ?? zeroBalance

  return formatBalance(poolTvlBalance, '', 0)
}
