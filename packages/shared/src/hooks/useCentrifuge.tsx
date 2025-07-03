import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

export const useAssets = (spokeChainId: number) => {
  const centrifuge = useCentrifuge()

  const asset$ = useMemo(() => {
    if (!spokeChainId) return undefined
    return centrifuge.assets(11155111)
  }, [spokeChainId])

  return useObservable(asset$)
}
