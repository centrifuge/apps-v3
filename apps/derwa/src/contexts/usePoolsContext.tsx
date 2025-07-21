import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Pool, PoolId } from '@centrifuge/sdk'
import { usePoolsQuery } from '@centrifuge/shared'
import { useParams } from 'react-router-dom'

const PoolsContext = createContext<
  | {
      pools: Pool[] | undefined
      selectedPoolId: PoolId | undefined
      setSelectedPoolId: (poolId: PoolId) => void
      isLoading: boolean
    }
  | undefined
>(undefined)

export const PoolsProvider = ({ children }: { children: ReactNode }) => {
  const { data: pools, isLoading } = usePoolsQuery()
  const [selectedPoolId, setSelectedPoolId] = useState<PoolId | undefined>(undefined)

  const { poolId } = useParams()
  const currentPagePoolId = pools?.find((pool) => pool.id.toString() === poolId)?.id

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
    <PoolsContext.Provider value={{ pools, selectedPoolId, setSelectedPoolId, isLoading }}>
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
