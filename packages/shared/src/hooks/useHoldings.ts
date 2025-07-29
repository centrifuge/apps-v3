import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

export const useAssets = (spokeChainId?: number, hubChainId?: number, enabled?: boolean) => {
  const centrifuge = useCentrifuge()

  const asset$ = useMemo(() => {
    if (!spokeChainId || !enabled) return undefined
    return centrifuge.assets(Number(spokeChainId), Number(hubChainId))
  }, [spokeChainId, hubChainId, enabled])

  return useObservable(asset$)
}

export const useAssetValuation = (chainId: number) => {
  const centrifuge = useCentrifuge()

  const assetValuation$ = useMemo(() => {
    if (!chainId) return undefined
    return centrifuge.valuations(Number(chainId))
  }, [chainId])

  return useObservable(assetValuation$)
}
