import { ShareClass } from '@centrifuge/sdk'
import { useObservable } from './useObservable'
import { useMemo } from 'react'
import { PendingAmount } from '../types'
import { map, of } from 'rxjs'
import { useCentrifuge } from './CentrifugeContext'

export function useNavPerNetwork(shareClass: ShareClass) {
  const navPerNetwork$ = useMemo(() => shareClass.navPerNetwork(), [shareClass])
  return useObservable(navPerNetwork$)
}

export function useHoldings(shareClass: ShareClass) {
  const holdings$ = useMemo(() => shareClass?.balances(), [shareClass])
  return useObservable(holdings$)
}

export function useHolding(shareClass: ShareClass, holdingId?: string) {
  const holdings$ = useMemo(() => shareClass.balances(), [shareClass])
  const holding$ = useMemo(() => {
    if (!holdingId || !holdings$) return of(undefined)
    return holdings$.pipe(map((h) => h.find((h) => h.assetId.raw.toString() === holdingId)))
  }, [holdings$, holdingId])
  return useObservable(holding$)
}

export const usePendingAmounts = (shareClass: ShareClass) => {
  const pendingAmounts$ = useMemo(() => shareClass?.pendingAmounts(), [shareClass])
  return useObservable(pendingAmounts$)
}

export const useGroupPendingAmountsByChain = (pendingAmounts: PendingAmount) => {
  return useMemo(() => {
    return pendingAmounts?.reduce<Record<number, PendingAmount[number][]>>((acc, curr) => {
      acc[curr.chainId] = [...(acc[curr.chainId] || []), curr]
      return acc
    }, {})
  }, [pendingAmounts])
}

export const useBalanceSheet = (shareClass: ShareClass, chainId: number) => {
  const balanceSheet$ = useMemo(() => shareClass?.balanceSheet(chainId), [shareClass, chainId])
  return useObservable(balanceSheet$)
}

export const useVaultsPerShareClass = (shareClass: ShareClass) => {
  const vaults$ = useMemo(() => shareClass?.vaults(), [shareClass])
  return useObservable(vaults$)
}
