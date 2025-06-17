import { useCallback } from 'react'
import { PoolId, type PoolMetadata } from '@centrifuge/sdk'
import { useCentrifugeTransaction } from './useCentrifugeTransaction'
import { usePool } from './usePools'

export function useUpdatePoolMetadata(poolId: PoolId, metadata: PoolMetadata) {
  const { data: pool } = usePool(poolId)

  const { execute, isError, error, isSuccess } = useCentrifugeTransaction()

  const updateMetadata = useCallback(async () => {
    if (!pool) {
      throw new Error('No pool found')
    }
    const txObservable = pool.updateMetadata(metadata)

    return execute(txObservable)
  }, [pool, execute])

  return {
    updateMetadata,
    isError,
    error,
    isSuccess,
  }
}
