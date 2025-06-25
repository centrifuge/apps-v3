import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, switchMap } from 'rxjs'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

const IDS = ['281474976710658']

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

export function usePoolDetails(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const details$ = useMemo(() => (pool ? pool?.details() : undefined), [pool])
  return useObservable(details$)
}

export function useAllPoolDetails() {
  const centrifuge = useCentrifuge()
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
