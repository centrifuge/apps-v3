import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { centrifuge } from '../centrifuge'
import { useObservable } from './useObservable'

const pools$ = centrifuge.pools()
export function usePools() {
  return useObservable(pools$)
}

export function usePool(poolId: PoolId) {
  const pools = usePools()
  const pool = pools.data?.find((p) => p.id.equals(poolId))
  return pool
}

export function usePoolDetails(poolId: PoolId) {
  const pool = usePool(poolId)
  const details$ = useMemo(() => pool?.details(), [pool])
  return useObservable(details$)
}
