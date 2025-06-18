import { useMemo } from 'react'
import { centrifuge } from '../centrifuge'
import { useObservable } from './useObservable'
import { useAccount } from 'wagmi'

export function useInvestor() {
  const { address } = useAccount()
  const investor$ = useMemo(() => (address ? centrifuge.investor(address) : undefined), [address])
  return useObservable(investor$)
}

export function usePortfolio() {
  const { data: account } = useInvestor()
  const portfolio$ = useMemo(() => (account ? account?.portfolio() : undefined), [account])
  return useObservable(portfolio$)
}
