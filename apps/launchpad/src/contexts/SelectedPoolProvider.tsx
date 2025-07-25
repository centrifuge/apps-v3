import React, { createContext, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PoolId, Vault } from '@centrifuge/sdk'
import { PoolDetails, usePoolDetails, ShareClassWithDetails, usePoolNetworks, useVaults } from '@centrifuge/shared'
import { useChainId } from 'wagmi'

interface SelectedPoolContextValue {
  poolId?: PoolId
  poolDetails?: PoolDetails
  shareClass?: ShareClassWithDetails
  vaults?: Vault[]
  isLoading: boolean
}

const SelectedPoolContext = createContext<SelectedPoolContextValue | undefined>(undefined)

export const SelectedPoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { poolId: poolParam, shareClassId: scParam } = useParams<{ poolId: string; shareClassId: string }>()
  const connectedChainId = useChainId()

  const poolId = useMemo(() => {
    if (!poolParam) return undefined
    return new PoolId(poolParam)
  }, [poolParam])

  const { data: poolDetails } = usePoolDetails(poolId, { enabled: !!poolId })
  const { data: networks } = usePoolNetworks(poolDetails?.id!)

  const network = useMemo(() => {
    return networks?.find((n) => n.chainId === connectedChainId)
  }, [networks, connectedChainId])

  const shareClass = useMemo(() => {
    if (!poolDetails) return undefined
    return poolDetails?.shareClasses.find((sc) => sc.shareClass.id.toString() === scParam)
  }, [poolDetails, scParam])

  const { data: vaults } = useVaults(network, shareClass?.details.id)

  const isLoading = useMemo(() => {
    return !poolDetails || !networks || !shareClass || !vaults
  }, [poolDetails, networks, shareClass, vaults])

  return (
    <SelectedPoolContext.Provider value={{ poolId, poolDetails, shareClass, vaults, isLoading }}>
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
