import React, { createContext, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PoolId } from '@centrifuge/sdk'
import { PoolDetails, usePoolDetails, ShareClassWithDetails } from '@centrifuge/shared'

interface SelectedPoolContextValue {
  poolId?: PoolId
  poolDetails?: PoolDetails
  shareClass?: ShareClassWithDetails
}

const SelectedPoolContext = createContext<SelectedPoolContextValue | undefined>(undefined)

export const SelectedPoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { poolId: poolParam, shareClassId: scParam } = useParams<{ poolId: string; shareClassId: string }>()

  const poolId = useMemo(() => {
    if (!poolParam) return undefined
    return new PoolId(poolParam)
  }, [poolParam])

  const { data: poolDetails } = usePoolDetails(poolId, { enabled: !!poolId })

  const shareClass = useMemo(() => {
    if (!poolDetails) return undefined
    return poolDetails.shareClasses.find((sc) => sc.shareClass.id.toString() === scParam)
  }, [poolDetails, scParam])

  return (
    <SelectedPoolContext.Provider value={{ poolId, poolDetails, shareClass }}>{children}</SelectedPoolContext.Provider>
  )
}

export function useSelectedPool(): SelectedPoolContextValue {
  const ctx = useContext(SelectedPoolContext)
  if (!ctx) {
    throw new Error('useSelectedPool must be used within SelectedPoolProvider')
  }
  return ctx
}
