import { Pool, PoolId, ShareClass } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, from, map, of, switchMap } from 'rxjs'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'
import { Address } from 'viem'

const EMPTY_POOLS = { data: [], isLoading: false }

export function usePools() {
  const centrifuge = useCentrifuge()
  const pools$ = useMemo(() => centrifuge.pools(), [])
  return useObservable(pools$)
}

export function usePoolsByManager(manager: Address | undefined) {
  if (!manager) return EMPTY_POOLS

  const { data: allPools } = usePools()

  const pools$ = useMemo(() => {
    if (!allPools || allPools.length === 0) {
      return of<Pool[]>([])
    }

    const checked$ = allPools.map((pool) =>
      from(pool.isManager(manager)).pipe(map((isMgr) => (isMgr ? pool : undefined)))
    )

    return combineLatest(checked$).pipe(map((maybePools) => maybePools.filter((p): p is Pool => !!p)))
  }, [allPools, manager])

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

export function useAllPoolDetails(ids: PoolId[]) {
  const centrifuge = useCentrifuge()

  const details$ = useMemo(
    () => combineLatest(ids.map((id) => centrifuge.pool(id).pipe(switchMap((pool) => pool.details())))),
    []
  )

  return useObservable(details$)
}

export function usePoolNetworks(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const vaults$ = useMemo(() => (pool ? pool?.activeNetworks() : undefined), [pool])
  return useObservable(vaults$)
}
