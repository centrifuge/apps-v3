import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Balance, Pool, PoolId, PoolNetwork, ShareClassId } from '@centrifuge/sdk'
import {
  formatBalance,
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
  const { data: pools, isLoading } = usePoolsQuery()
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
  const zeroBalance: Balance = new Balance(0n, 18)

  const poolTvlBalance =
    poolDetails?.shareClasses.reduce((acc, shareClass) => {
      const { totalIssuance, pricePerShare } = shareClass.details
      const tvl = totalIssuance.mul(pricePerShare)
      return acc.add(tvl)
    }, zeroBalance) ?? zeroBalance

  const poolTVL = formatBalance(poolTvlBalance, '', 0)

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
