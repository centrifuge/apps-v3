import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { PoolId } from '@centrifuge/sdk'
import { usePools } from '@centrifuge/shared'

const SelectedPoolContext = createContext<
  | {
      selectedPoolId: PoolId | undefined
      setSelectedPoolId: (poolId: PoolId) => void
      isLoading: boolean
    }
  | undefined
>(undefined)

export const SelectedPoolProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: pools, isLoading } = usePools()
  const [selectedPoolId, setSelectedPoolId] = useState<PoolId | undefined>(undefined)

  // Use a ref to track if we've already set the initial pool ID
  const hasSetInitialPoolRef = useRef(false)

  useEffect(() => {
    if (!isLoading) {
      if (pools?.length && !hasSetInitialPoolRef.current) {
        setSelectedPoolId(pools[0].id)
        hasSetInitialPoolRef.current = true
      }

      if (pools && pools.length === 0 && hasSetInitialPoolRef.current) {
        hasSetInitialPoolRef.current = false
      }
    }
  }, [pools])

  return (
    <SelectedPoolContext.Provider value={{ selectedPoolId, setSelectedPoolId, isLoading }}>
      {children}
    </SelectedPoolContext.Provider>
  )
}

export const useSelectedPoolContext = () => {
  const context = useContext(SelectedPoolContext)
  if (!context) {
    throw new Error('useSelectedPoolContext must be used within a SelectedPoolProvider')
  }
  return context
}
