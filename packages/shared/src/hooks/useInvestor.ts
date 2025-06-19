import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { useAccount } from 'wagmi'
import { useCentrifuge } from './CentrifugeContext'

export function useInvestor() {
  const centrifuge = useCentrifuge()
  const { address } = useAccount()
  const investor$ = useMemo(() => (address ? centrifuge.investor(address) : undefined), [address, centrifuge])
  return useObservable(investor$)
}

export function usePortfolio() {
  const { data: account } = useInvestor()
  const portfolio$ = useMemo(() => (account ? account?.portfolio() : undefined), [account])
  return useObservable(portfolio$)
}
