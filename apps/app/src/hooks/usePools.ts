import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { centrifuge } from '../centrifuge'
import { useObservable } from './useObservable'

const pools$ = centrifuge.pools()
export function usePools() {
  return useObservable(pools$)
}

export function usePool(poolId?: PoolId) {
  const pool$ = useMemo(() => (poolId ? centrifuge.pool(poolId) : undefined), [poolId])
  return useObservable(pool$)
}

export function usePoolDetails(poolId: PoolId) {
  const { data: pool } = usePool(poolId)
  const details$ = useMemo(() => pool?.details(), [pool])
  return useObservable(details$)
}
