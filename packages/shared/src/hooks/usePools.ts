import Centrifuge, { Pool, PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, of, switchMap } from 'rxjs'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

const ID = '281474976710657'

export const createPool = () => {
  const centrifuge = useCentrifuge()
  const pool = useMemo(() => new Pool(centrifuge, ID, 11155111), [centrifuge])
  return pool
}

export function usePools() {
  const pools = createPool()
  // const pools$ = useMemo(() => centrifuge.pools(), [centrifuge])
  // return useObservable(pools$)
  return of([pools])
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
  const pool = createPool()
  const details$ = useMemo(() => pool.details(), [pool])
  return useObservable(details$)
}

export function usePoolNetworks(poolId?: PoolId) {
  const { data: pool } = usePool(poolId)
  const vaults$ = useMemo(() => (pool ? pool?.activeNetworks() : undefined), [pool])
  return useObservable(vaults$)
}
