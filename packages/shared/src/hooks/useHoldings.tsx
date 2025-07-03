import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

export const useAssets = (spokeChainId: number, hubChainId?: number) => {
  const centrifuge = useCentrifuge()

  const asset$ = useMemo(() => {
    if (!spokeChainId) return undefined
    return centrifuge.assets(spokeChainId, hubChainId)
  }, [spokeChainId, hubChainId])

  return useObservable(asset$)
}
