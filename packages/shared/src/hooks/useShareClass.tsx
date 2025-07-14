import { ShareClass } from '@centrifuge/sdk'
import { useObservable } from './useObservable'
import { useMemo } from 'react'
import { PendingAmount } from '../types'

export function useNavPerNetwork(shareClass?: ShareClass) {
  const navPerNetwork$ = useMemo(() => (shareClass ? shareClass.navPerNetwork() : undefined), [shareClass])
  return useObservable(navPerNetwork$)
}

export function useHoldings(shareClass: ShareClass) {
  const holdings$ = useMemo(() => shareClass.holdings(), [shareClass])
  return useObservable(holdings$)
}

export const usePendingAmounts = (shareClass: ShareClass) => {
  const pendingAmounts$ = useMemo(() => shareClass?.pendingAmounts(), [shareClass])
  return useObservable(pendingAmounts$)
}

export const useGroupPendingAmountsByChain = (pendingAmounts: PendingAmount[]) => {
  return useMemo(() => {
    return pendingAmounts?.reduce<Record<number, PendingAmount[]>>((acc, curr) => {
      acc[curr.chainId] = [...(acc[curr.chainId] || []), curr]
      return acc
    }, {})
  }, [pendingAmounts])
}
