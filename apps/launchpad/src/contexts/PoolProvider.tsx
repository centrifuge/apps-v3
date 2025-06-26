import React, { createContext, useContext, useMemo } from 'react'
import { useChainId } from 'wagmi'
import { PoolId } from '@centrifuge/sdk'
import { useAllInvestments, usePoolDetails, usePoolNetworks, useVaults, useVaultsDetails } from '@centrifuge/shared'
import { useParams } from 'react-router'

// TODO: fix types
interface PoolContextValue {
  poolDetails: any
  networks: any
  network: any
  shareClass: any
  scId: any
  vaults: any
  vaultsDetails: any
  allInvestments: any
  isLoading: boolean
  error?: any
}

const PoolContext = createContext<PoolContextValue | undefined>(undefined)

interface PoolProviderProps {
  children: React.ReactNode
}

export function PoolProvider({ children }: PoolProviderProps) {
  const params = useParams()
  const poolId = params.poolId
  const connectedChainId = useChainId()

  // Memoize PoolId to prevent infinite re-renders
  const memoizedPoolId = useMemo(() => {
    return poolId ? new PoolId(poolId) : undefined
  }, [poolId])

  const { data: poolDetails, isLoading: poolLoading, error: poolError } = usePoolDetails(memoizedPoolId)
  const { data: networks, isLoading: networksLoading } = usePoolNetworks(poolDetails?.id)

  const network = useMemo(() => {
    return networks?.find((n) => n.chainId === connectedChainId)
  }, [networks, connectedChainId])

  // TODO: For MVP, we are assuming one share class per pool
  const shareClass = poolDetails?.shareClasses?.[0]
  const scId = shareClass?.details.id

  const { data: vaults, isLoading: vaultsLoading } = useVaults(network, scId)
  const { data: vaultsDetails, isLoading: vaultsDetailsLoading } = useVaultsDetails(vaults)
  const { data: allInvestments, isLoading: allInvestmentsLoading } = useAllInvestments(vaults)

  const isLoading = poolLoading || networksLoading || vaultsLoading || vaultsDetailsLoading || allInvestmentsLoading

  const contextValue: PoolContextValue = {
    poolDetails,
    networks,
    network,
    shareClass,
    scId,
    vaults,
    vaultsDetails,
    allInvestments,
    isLoading,
    error: poolError,
  }

  return <PoolContext.Provider value={contextValue}>{children}</PoolContext.Provider>
}

export function usePoolProvider() {
  const context = useContext(PoolContext)
  if (context === undefined) {
    throw new Error('usePool must be used within a PoolProvider')
  }
  return context
}
