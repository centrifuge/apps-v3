import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, of, switchMap } from 'rxjs'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

export function usePools() {
  const centrifuge = useCentrifuge()
  const pools$ = useMemo(() => centrifuge.pools(), [centrifuge])
  return useObservable(pools$)
}

export function usePool(poolId?: PoolId) {
  const centrifuge = useCentrifuge()
  const pool$ = useMemo(() => (poolId ? centrifuge.pool(poolId) : undefined), [poolId])
  return useObservable(pool$)
}

export function usePoolDetails(poolId: PoolId) {
  const { data: pool } = usePool(poolId)
  const details$ = useMemo(() => (pool ? pool?.details() : undefined), [pool])
  return useObservable(details$)
}

export function useAllPoolDetails() {
  const { data: pools } = usePools()
  const centrifuge = useCentrifuge()

  if (!pools) return of([])

  const details$ = useMemo(
    () => combineLatest(pools.map((pool) => centrifuge.pool(pool.id).pipe(switchMap((pool) => pool.details())))),
    []
  )

  return useObservable(details$)
}

export function usePoolNetworks(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const vaults$ = useMemo(() => (pool ? pool?.activeNetworks() : undefined), [pool])
  return useObservable(vaults$)
}
