import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Pool, PoolId, PoolNetwork, ShareClassId } from '@centrifuge/sdk'
import { PoolDetails, ShareClassWithDetails, usePoolDetails, usePoolNetworks, usePoolsQuery } from '@centrifuge/shared'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'

const PoolsContext = createContext<
  | {
      pools: Pool[] | undefined
      poolDetails: PoolDetails | undefined
      selectedPoolId: PoolId | undefined
      setSelectedPoolId: (poolId: PoolId) => void
      isLoading: boolean
      isPoolDetailsLoading: boolean
      network: PoolNetwork | undefined
      networks: PoolNetwork[] | undefined
      isNetworksLoading: boolean
      shareClass: ShareClassWithDetails | undefined
      shareClassId: ShareClassId | undefined
    }
  | undefined
>(undefined)

export const PoolsProvider = ({ children }: { children: ReactNode }) => {
  const { data: pools, isLoading } = usePoolsQuery()
  const [selectedPoolId, setSelectedPoolId] = useState<PoolId | undefined>(undefined)

  const { poolId } = useParams()
  const currentPagePoolId = pools?.find((pool) => pool.id.toString() === poolId)?.id

  const { data: poolDetails, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId as PoolId)
  const { data: networks, isLoading: isNetworksLoading } = usePoolNetworks(poolDetails?.id)
  const connectedChainId = useChainId()

  const network = useMemo(() => {
    return networks?.find((n) => n.chainId === connectedChainId)
  }, [networks, connectedChainId])

  // In MVP we assume one share class per pool
  const shareClass = poolDetails?.shareClasses?.[0]
  const shareClassId = shareClass?.details.id

  // Use a ref to track if we've already set the initial pool ID
  const hasSetInitialPoolRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !!pools) {
      if (pools?.length && !hasSetInitialPoolRef.current) {
        setSelectedPoolId(currentPagePoolId ?? pools[0].id)
        hasSetInitialPoolRef.current = true
      } else {
        hasSetInitialPoolRef.current = false
      }
    }
  }, [pools])

  return (
    <PoolsContext.Provider
      value={{
        pools,
        selectedPoolId,
        setSelectedPoolId,
        isLoading,
        poolDetails,
        isPoolDetailsLoading,
        network,
        networks,
        isNetworksLoading,
        shareClass,
        shareClassId,
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}

export const usePoolsContext = () => {
  const context = useContext(PoolsContext)
  if (!context) {
    throw new Error('usePoolsContext must be used within a PoolsProvider')
  }
  return context
}
