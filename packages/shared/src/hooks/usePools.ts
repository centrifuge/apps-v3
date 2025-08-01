import { HexString, PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, map, of, switchMap } from 'rxjs'
import { Address } from 'viem'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

interface Options {
  enabled?: boolean
}

export function usePools() {
  const centrifuge = useCentrifuge()

  const pools$ = useMemo(() => {
    return centrifuge.pools()
  }, [centrifuge])

  return useObservable(pools$)
}

export function usePoolsByManager(address: Address) {
  const centrifuge = useCentrifuge()

  const pools$ = useMemo(() => {
    if (!address) return of([])

    return centrifuge.pools().pipe(
      switchMap((pools) => {
        if (!pools.length) return of([])
        return combineLatest(
          pools.map((pool) => pool.isPoolManager(address).pipe(map((isManager) => (isManager ? pool : null))))
        ).pipe(map((results) => results.filter((p) => p !== null)))
      })
    )
  }, [address, centrifuge])

  return useObservable(pools$)
}

export function usePool(poolId: PoolId) {
  const centrifuge = useCentrifuge()
  const pool$ = useMemo(() => {
    if (!poolId) return undefined
    return centrifuge.pool(poolId)
  }, [poolId])

  return useObservable(pool$)
}

export function usePoolDetails(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true

  const details$ = useMemo(() => {
    if (!enabled || !poolId) return undefined
    return centrifuge.pool(poolId).pipe(switchMap((pool) => (pool ? pool.details() : of(undefined))))
  }, [poolId, centrifuge, enabled])

  return useObservable(details$)
}

export function useAllPoolDetails(poolIds: PoolId[], options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true

  const details$ = useMemo(() => {
    if (!enabled || !poolIds?.length) {
      return of([])
    }

    const poolDetailObservables$ = poolIds.map((id) => centrifuge.pool(id).pipe(switchMap((pool) => pool.details())))

    return combineLatest(poolDetailObservables$)
  }, [poolIds, centrifuge, enabled])

  return useObservable(details$)
}

export function usePoolNetworks(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true

  const vaults$ = useMemo(() => {
    if (!enabled || !poolId) return undefined
    return centrifuge.pool(poolId).pipe(switchMap((pool) => (pool ? pool.activeNetworks() : of(undefined))))
  }, [poolId, centrifuge])

  return useObservable(vaults$)
}

export function useIsPoolManager(poolId?: PoolId, address?: HexString) {
  const centrifuge = useCentrifuge()

  const isManager$ = useMemo(() => {
    if (!poolId || !address) return of(false)
    return centrifuge.pool(poolId).pipe(switchMap((pool) => pool.isPoolManager(address)))
  }, [centrifuge, poolId, address])

  return useObservable(isManager$).data
}

export function useIsBalanceSheetManager(poolId?: PoolId, address?: HexString, chainId?: number) {
  const centrifuge = useCentrifuge()

  const isBalanceSheetManager$ = useMemo(() => {
    if (!poolId || !address || !chainId) return of(false)
    return centrifuge.pool(poolId).pipe(switchMap((pool) => pool.isBalanceSheetManager(chainId, address)))
  }, [centrifuge, poolId, address])

  return useObservable(isBalanceSheetManager$).data
}

export const useRestrictionHooks = (chainId?: number) => {
  const centrifuge = useCentrifuge()
  const restrictionHook$ = useMemo(
    () => (chainId ? centrifuge?.restrictionHooks(chainId) : undefined),
    [centrifuge, chainId]
  )
  return useObservable(restrictionHook$)
}
