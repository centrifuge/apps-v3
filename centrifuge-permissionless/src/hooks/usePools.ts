import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, switchMap } from 'rxjs'
import { centrifuge } from '../centrifuge'
import { useObservable } from './useObservable'

const IDS = ['281474976710657']

const pools$ = centrifuge.pools()

export function usePools() {
  return useObservable(pools$)
}

export function usePool(poolId?: PoolId) {
  const pool$ = useMemo(() => (poolId ? centrifuge.pool(poolId) : undefined), [poolId])
  return useObservable(pool$)
}

export function usePoolDetails(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const details$ = useMemo(() => (pool ? pool?.details() : undefined), [pool])
  return useObservable(details$)
}

export function useAllPoolDetails() {
  const details$ = useMemo(
    () => combineLatest(IDS.map((id) => centrifuge.pool(new PoolId(id)).pipe(switchMap((pool) => pool.details())))),

    []
  )

  return useObservable(details$)
}

export function usePoolNetworks(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const vaults$ = useMemo(() => (pool ? pool?.activeNetworks() : undefined), [pool])
  return useObservable(vaults$)
}
