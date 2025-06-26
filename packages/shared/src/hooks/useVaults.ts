import type { PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { combineLatest } from 'rxjs'
import { useObservable } from './useObservable'

export function useVaults(poolNetwork?: PoolNetwork, scId?: ShareClassId) {
  const vaults$ = useMemo(() => (poolNetwork && scId ? poolNetwork.vaults(scId) : undefined), [poolNetwork, scId])
  return useObservable(vaults$)
}

export function useVaultDetails(vault?: Vault) {
  const vaultDetails$ = useMemo(() => (vault ? vault.details() : undefined), [vault])
  return useObservable(vaultDetails$)
}

export function useVaultsDetails(vaults?: Vault[]) {
  const vaultsDetails$ = useMemo(() => {
    if (!vaults || vaults.length === 0) return undefined

    const vaultDetails$ = vaults.map((vault) => vault.details())
    return combineLatest(vaultDetails$)
  }, [vaults])

  return useObservable(vaultsDetails$)
}

export function useInvestment(vault?: Vault) {
  const { address } = useAccount()
  const investment$ = useMemo(() => (vault && address ? vault.investment(address) : undefined), [vault, address])
  return useObservable(investment$)
}

export function useAllInvestments(vaults?: Vault[]) {
  const { address } = useAccount()

  const allInvestments$ = useMemo(() => {
    if (!vaults || vaults.length === 0 || !address) return undefined

    const investment$ = vaults.map((vault) => vault.investment(address))
    return combineLatest(investment$)
  }, [vaults, address])

  return useObservable(allInvestments$)
}
