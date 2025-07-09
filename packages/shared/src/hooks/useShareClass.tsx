import { ShareClass } from '@centrifuge/sdk'
import { useObservable } from './useObservable'
import { useMemo } from 'react'

export function useNavPerNetwork(shareClass: ShareClass) {
  const navPerNetwork$ = useMemo(() => shareClass.navPerNetwork(), [shareClass])
  return useObservable(navPerNetwork$)
}

export function useHoldings(shareClass: ShareClass) {
  const holdings$ = useMemo(() => shareClass.holdings(), [shareClass])
  return useObservable(holdings$)
}

export function usePendingAmounts(shareClass: ShareClass) {
  const pendingAmounts$ = useMemo(() => shareClass?.pendingAmounts(), [shareClass])
  return useObservable(pendingAmounts$)
}
