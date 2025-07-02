import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, map, of, switchMap } from 'rxjs'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'
import { Address } from 'viem'

export function usePools() {
  const centrifuge = useCentrifuge()
  const pools$ = useMemo(
    () => centrifuge.pools().pipe(map((pools) => pools.filter((p) => p.chainId === 11155111))),
    [centrifuge]
  )
  return useObservable(pools$)
}

export function usePoolsByManager(address: Address | undefined) {
  const { data: pools } = usePools()
  const stableKey = useMemo(() => pools?.map((p) => p.id).join(',') || '', [pools?.map((p) => p.id).join(',')])

  const pools$ = useMemo(() => {
    if (!address || !pools) return of([])
    return combineLatest(
      pools.map((pool) => pool.isManager(address).pipe(map((isManager) => (isManager ? pool : null))))
    ).pipe(map((pools) => pools.filter((p) => p !== null)))
  }, [stableKey, address])

  return useObservable(pools$)
}

export function usePool(poolId?: PoolId) {
  const centrifuge = useCentrifuge()
  const pool$ = useMemo(() => (poolId ? centrifuge.pool(poolId) : undefined), [poolId])
  return useObservable(pool$)
}

export function usePoolDetails(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const details$ = useMemo(() => (pool ? pool?.details() : undefined), [pool])
  return useObservable(details$)
}

export function useAllPoolDetails(poolIds: PoolId[]) {
  const centrifuge = useCentrifuge()

  const poolIdsKey = useMemo(() => poolIds?.join(',') || '', [poolIds?.join(',')])

  const details$ = useMemo(() => {
    if (!poolIds?.length) return of([])
    // TODO: fix the hardcoded one, we need to update the metadata for existing pools or update sdk to return even if missing metadata
    return combineLatest([poolIds[0]].map((id) => centrifuge.pool(id).pipe(switchMap((pool) => pool.details()))))
  }, [poolIdsKey])

  return useObservable(details$)
}

export function usePoolNetworks(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const vaults$ = useMemo(() => (pool ? pool?.activeNetworks() : undefined), [pool])
  return useObservable(vaults$)
}
