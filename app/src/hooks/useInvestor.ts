import { Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { centrifuge } from '../centrifuge'
import { useObservable } from './useObservable'

export function useInvestor() {
  // TODO: replace if needed when we have a wallet connect library
  const { address } = useAccount()
  const investor$ = useMemo(() => (address ? centrifuge.investor(address) : undefined), [address])
  return useObservable(investor$)
}

export function useInvestorCurrencyBalances() {
  const { data: investor } = useInvestor()
  // TODO: replace if needed when we have a wallet connect library
  const { chainId } = useAccount()
  const balance$ = useMemo(
    () => (investor && chainId ? investor.currencyBalances(chainId) : undefined),
    [investor, chainId]
  )
  return useObservable(balance$)
}

export function useInvestment(vault?: Vault) {
  const { data: investor } = useInvestor()
  const investment$ = useMemo(
    () => (investor && vault ? vault.investment(investor.address) : undefined),
    [investor, vault]
  )
  return useObservable(investment$)
}
