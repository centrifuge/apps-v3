import React, { createContext, useContext, useMemo } from 'react'
import { useChainId } from 'wagmi'
import { Pool, PoolId, PoolNetwork, ShareClass, ShareClassId, Vault } from '@centrifuge/sdk'
import {
  PoolDetails,
  ShareClassWithDetails,
  useInvestmentsPerVaults,
  usePool,
  usePoolDetails,
  usePoolNetworks,
  useVaults,
  useVaultsDetails,
  VaultDetails,
} from '@centrifuge/shared'
import { useParams } from 'react-router'

interface PoolContextValue {
  pool: Pool | undefined
  poolDetails: PoolDetails | undefined
  networks: PoolNetwork[] | undefined
  network: PoolNetwork | undefined
  shareClass: ShareClassWithDetails | undefined
  scId: ShareClassId | undefined
  vaults: Vault[] | undefined
  vaultsDetails: VaultDetails[] | undefined
  investmentsPerVaults: any
  isLoading: boolean
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

  const { data: pool } = usePool(memoizedPoolId!)
  const { data: poolDetails, isLoading: poolLoading } = usePoolDetails(memoizedPoolId!)
  const { data: networks, isLoading: networksLoading } = usePoolNetworks(poolDetails?.id!)

  const network = useMemo(() => {
    return networks?.find((n) => n.chainId === connectedChainId)
  }, [networks, connectedChainId])

  // TODO: For MVP, we are assuming one share class per pool
  const shareClass = poolDetails?.shareClasses?.[0]
  const scId = shareClass?.details.id

  const { data: vaults, isLoading: vaultsLoading } = useVaults(network, scId)
  const { data: vaultsDetails, isLoading: vaultsDetailsLoading } = useVaultsDetails(vaults)
  const { data: investmentsPerVaults, isLoading: investmentsPerVaultsLoading } = useInvestmentsPerVaults(vaults)

  const isLoading =
    poolLoading || networksLoading || vaultsLoading || vaultsDetailsLoading || investmentsPerVaultsLoading

  const contextValue: PoolContextValue = {
    pool,
    poolDetails,
    networks,
    network,
    shareClass,
    scId,
    vaults,
    vaultsDetails,
    investmentsPerVaults,
    isLoading,
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
