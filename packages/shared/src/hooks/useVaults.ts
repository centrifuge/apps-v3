import type { PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, of } from 'rxjs'
import { useObservable } from './useObservable'
import { useAddress } from './useAddress'

export function useVaults(poolNetwork?: PoolNetwork, scId?: ShareClassId) {
  const vaults$ = useMemo(() => (poolNetwork && scId ? poolNetwork.vaults(scId) : undefined), [poolNetwork, scId])
  return useObservable(vaults$)
}

export function useVaultDetails(vault: Vault | null) {
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
  const { address } = useAddress()
  const investment$ = useMemo(() => (vault && address ? vault.investment(address) : undefined), [vault, address])
  return useObservable(investment$)
}

export function useInvestmentsPerVaults(vaults?: Vault[]) {
  const { address } = useAddress()
  const investmentsPerVaults$ = useMemo(() => {
    if (!vaults || !vaults.length || !address) return of([])

    const investment$ = vaults.map((vault) => vault.investment(address))
    return combineLatest(investment$)
  }, [vaults, address])

  return useObservable(investmentsPerVaults$)
}
