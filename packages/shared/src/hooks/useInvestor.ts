import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'
import { useAddress } from './useAddress'
import { ShareClassId } from '@centrifuge/sdk'

export function useInvestor() {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  const investor$ = useMemo(() => (address ? centrifuge.investor(address) : undefined), [address, centrifuge])
  return useObservable(investor$)
}

export function usePortfolio() {
  const { data: account } = useInvestor()
  const portfolio$ = useMemo(() => (account ? account?.portfolio() : undefined), [account])
  return useObservable(portfolio$)
}

export function useIsMember(shareClassId?: ShareClassId, chainId?: number) {
  const { data: account } = useInvestor()
  const isMember$ = useMemo(() => {
    if (!account || !shareClassId || !chainId) return undefined
    return account.isMember(shareClassId, chainId)
  }, [account, chainId, shareClassId])
  return useObservable(isMember$)
}
