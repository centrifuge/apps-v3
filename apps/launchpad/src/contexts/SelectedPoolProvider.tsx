import React, { createContext, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Pool, PoolId, ShareClass, Vault } from '@centrifuge/sdk'
import { PoolDetails, usePoolDetails, usePoolNetworks, useVaults, usePool, ShareClassDetails } from '@centrifuge/shared'
import { useChainId } from 'wagmi'

interface SelectedPoolContextValue {
  isLoading: boolean
  pool?: Pool
  poolCurrency?: PoolDetails['currency']
  poolDetails?: PoolDetails
  poolId?: PoolId
  shareClass?: ShareClass
  shareClassDetails?: ShareClassDetails
  vaults?: Vault[]
}

const SelectedPoolContext = createContext<SelectedPoolContextValue | undefined>(undefined)

export const SelectedPoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { poolId: poolParam, shareClassId: scParam } = useParams<{ poolId: string; shareClassId: string }>()
  const connectedChainId = useChainId()

  const poolId = useMemo(() => {
    if (!poolParam) return undefined
    return new PoolId(poolParam)
  }, [poolParam])

  const { data: pool, isLoading: isPoolLoading } = usePool(poolId!)
  const { data: poolDetails, isLoading: isPoolDetailsLoading } = usePoolDetails(poolId, { enabled: !!poolId })
  const { data: networks, isLoading: isNetworksLoading } = usePoolNetworks(poolDetails?.id!)

  const network = useMemo(() => {
    return networks?.find((n) => n.chainId === connectedChainId)
  }, [networks, connectedChainId])

  const shareClass = useMemo(() => {
    if (!poolDetails) return undefined
    return poolDetails?.shareClasses.find((sc) => sc.shareClass.id.toString() === scParam)
  }, [poolDetails, scParam])

  const { data: vaults, isLoading: isVaultsLoading } = useVaults(network, shareClass?.details.id)

  const isLoading = useMemo(() => {
    return isPoolLoading || isPoolDetailsLoading || isNetworksLoading || isVaultsLoading
  }, [isPoolLoading, isPoolDetailsLoading, isNetworksLoading, isVaultsLoading])

  const poolCurrency = useMemo(() => {
    return poolDetails?.currency
  }, [poolDetails])

  return (
    <SelectedPoolContext.Provider
      value={{
        pool,
        poolId,
        poolDetails,
        poolCurrency,
        shareClass: shareClass?.shareClass,
        shareClassDetails: shareClass?.details,
        vaults,
        isLoading,
      }}
    >
      {children}
    </SelectedPoolContext.Provider>
  )
}

export function useSelectedPool(): SelectedPoolContextValue {
  const ctx = useContext(SelectedPoolContext)
  if (!ctx) {
    throw new Error('useSelectedPool must be used within SelectedPoolProvider')
  }
  return ctx
}
