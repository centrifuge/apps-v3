import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Pool, PoolId, PoolNetwork, Vault } from '@centrifuge/sdk'
import {
  PoolDetails,
  ShareClassWithDetails,
  useInvestmentsPerVaults,
  usePoolDetails,
  usePoolNetworks,
  usePoolsQuery,
  useVaults,
  useVaultsDetails,
  VaultDetails,
} from '@centrifuge/shared'
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
      vaults: Vault[] | undefined
      isVaultsLoading: boolean
      vaultsDetails: VaultDetails[] | undefined
      isVaultsDetailsLoading: boolean
      investmentsPerVaults: unknown[] | undefined
      isInvestmentsPerVaultsLoading: boolean
      shareClass: ShareClassWithDetails | undefined
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
  const scId = shareClass?.details.id

  const { data: vaults, isLoading: isVaultsLoading } = useVaults(network, scId)
  const { data: vaultsDetails, isLoading: isVaultsDetailsLoading } = useVaultsDetails(vaults)
  const { data: investmentsPerVaults, isLoading: isInvestmentsPerVaultsLoading } = useInvestmentsPerVaults(vaults)

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
        vaults,
        isVaultsLoading,
        vaultsDetails,
        isVaultsDetailsLoading,
        investmentsPerVaults,
        isInvestmentsPerVaultsLoading,
        shareClass,
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
