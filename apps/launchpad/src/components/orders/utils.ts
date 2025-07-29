import { AssetId, Balance } from '@centrifuge/sdk'
import { useMemo } from 'react'

type Order = {
  chainId: number
  amount: Balance
  assetId: AssetId
}

export const useOrdersByChainId = (items: Order[]) => {
  if (!items) return {}

  const groupedItems = useMemo(() => {
    if (!items || items.length === 0) {
      return {}
    }

    return items.reduce(
      (acc, item) => {
        const groupValue = String(item.chainId)

        if (!acc[groupValue]) {
          acc[groupValue] = []
        }

        acc[groupValue].push(item)

        return acc
      },
      {} as Record<string, Order[]>
    )
  }, [items])

  return groupedItems
}

export const sumAmounts = (
  key: string,
  pendingOrders: any[] | undefined,
  poolCurrencyDecimals: number
): Balance | undefined => {
  return !pendingOrders
    ? undefined
    : pendingOrders?.reduce(
        (acc, order) => {
          const value = order[key as keyof typeof order]

          const amount = value instanceof Balance ? value : Balance.fromFloat(value as number, poolCurrencyDecimals)

          if (!amount) return acc

          const normalizedAmount = Balance.fromFloat(amount.toFloat(), poolCurrencyDecimals)

          return acc.add(normalizedAmount)
        },
        Balance.fromFloat(0, poolCurrencyDecimals)
      )
}

export const convertBalance = (balance: string, decimals: number) => {
  return Balance.fromFloat(balance, decimals)
}
