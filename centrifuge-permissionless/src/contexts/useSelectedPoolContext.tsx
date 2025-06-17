import { createContext, useContext, useEffect, useState } from 'react'
import { PoolId } from '@centrifuge/sdk'
import { usePools } from '../hooks/usePools'

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

  useEffect(() => {
    if (pools?.length) {
      setSelectedPoolId(pools[0].id)
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
