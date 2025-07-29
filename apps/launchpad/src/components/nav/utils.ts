import { Balance, Price } from '@centrifuge/sdk'

export const calculateNewNav = (nav: Balance, pricePerShare: string) => {
  if (!nav || !pricePerShare) return Balance.ZERO
  const tokenPrice = Price.fromFloat(pricePerShare)
  return nav.mul(tokenPrice)
}
