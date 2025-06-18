import type { PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useObservable } from './useObservable'

export function useVaults(poolNetwork?: PoolNetwork, scId?: ShareClassId) {
  const vaults$ = useMemo(() => (poolNetwork && scId ? poolNetwork.vaults(scId) : undefined), [poolNetwork, scId])
  return useObservable(vaults$)
}

export function useVaultDetails(vault?: Vault) {
  const vaultDetails$ = useMemo(() => (vault ? vault.details() : undefined), [vault])
  return useObservable(vaultDetails$)
}

export function useInvestment(vault?: Vault) {
  const { address } = useAccount()
  const investment$ = useMemo(() => (vault && address ? vault.investment(address) : undefined), [vault, address])
  return useObservable(investment$)
}
