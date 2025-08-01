import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Pool, PoolId, PoolNetwork, ShareClassId } from '@centrifuge/sdk'
import {
  Holdings,
  PoolDetails,
  ShareClassWithDetails,
  useHoldings,
  usePoolDetails,
  usePoolNetworks,
  usePoolsQuery,
} from '@centrifuge/shared'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { getPoolTVL } from '@utils/getPoolTVL'

const PoolsContext = createContext<
  | {
      holdings?: Holdings
      isLoading: boolean
      isNetworksLoading: boolean
      isPoolDetailsLoading: boolean
      isHoldingsLoading: boolean
      network: PoolNetwork | undefined
      networks: PoolNetwork[] | undefined
      pools: Pool[] | undefined
      poolDetails: PoolDetails | undefined
      poolTVL: string | undefined
      selectedPoolId: PoolId | undefined
      shareClass: ShareClassWithDetails | undefined
      shareClassId: ShareClassId | undefined
      setSelectedPoolId: (poolId: PoolId) => void
    }
  | undefined
>(undefined)

export const PoolsProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Remove hardcoded pool IDs after MVP
  // const dePoolsIds = [281474976710659n, 281474976710660n]
  const { data: pools, isLoading } = usePoolsQuery()
  // const filteredPools = pools?.filter((pool) => dePoolsIds.includes(pool.id.raw))

  const [network, setNetwork] = useState<PoolNetwork | undefined>(undefined)
  const [selectedPoolId, setSelectedPoolId] = useState<PoolId | undefined>(undefined)
  const { poolId } = useParams()
  const currentPagePoolId = pools?.find((pool) => pool.id.toString() === poolId)?.id
  const { data: poolDetails, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId as PoolId)

  // In MVP we assume one share class per pool
  const shareClass = poolDetails?.shareClasses?.[0]
  const shareClassId = shareClass?.details.id
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass?.shareClass)
  const { data: networks, isLoading: isNetworksLoading } = usePoolNetworks(poolDetails?.id)
  const connectedChainId = useChainId()

  const poolTVL = getPoolTVL(poolDetails as PoolDetails | undefined)

  useEffect(() => {
    if (networks?.length && connectedChainId) {
      const currentNetwork = networks.find((n) => n.chainId === connectedChainId)
      if (currentNetwork && currentNetwork !== network) {
        setNetwork(currentNetwork)
      }
    }
  })

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
        holdings,
        isHoldingsLoading,
        isLoading,
        isNetworksLoading,
        isPoolDetailsLoading,
        network,
        networks,
        pools,
        poolDetails: poolDetails as PoolDetails,
        poolTVL,
        selectedPoolId,
        shareClass,
        shareClassId,
        setSelectedPoolId,
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
