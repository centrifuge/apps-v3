import React, { createContext, useState, useContext, useMemo, useCallback } from 'react'
import { Observable } from 'rxjs'
import { useObservable } from '../../hooks/useObservable'
import { Loader } from '@chakra-ui/react'

interface LoadingContextType {
  registerLoadingState: (key: string, isLoading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: React.ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const registerLoadingState = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: isLoading }))
  }, [])

  const isAppLoading = useMemo(() => Object.values(loadingStates).some((state) => state), [loadingStates])

  const value = useMemo(() => ({ registerLoadingState }), [registerLoadingState])

  if (isAppLoading) {
    return <Loader />
  }

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

export function useLoadingObservable<T>(key: string, observable$: Observable<T>) {
  const context = useContext(LoadingContext)
  if (!context) throw new Error('useLoadingObservable must be used within a LoadingProvider')

  const { registerLoadingState } = context
  const result = useObservable(observable$)

  React.useEffect(() => {
    registerLoadingState(key, result.isLoading)
  }, [result.isLoading, key, registerLoadingState])

  return result
}
