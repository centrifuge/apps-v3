import { Vault } from '@centrifuge/sdk'
import {
  Investment,
  useInvestment,
  useInvestmentsPerVaults,
  useIsMember,
  useVaultDetails,
  useVaults,
  useVaultsDetails,
  VaultDetails,
} from '@centrifuge/shared'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

export interface VaultsContextValues {
  investment?: Investment
  investmentsPerVaults?: Investment[]
  isMember: boolean
  isInvestmentLoading: boolean
  isMemberLoading: boolean
  isVaultsLoading: boolean
  isVaultDetailsLoading: boolean
  vault?: Vault
  vaults?: Vault[]
  vaultDetails?: VaultDetails
  vaultsDetails?: VaultDetails[]
  setVault: Dispatch<SetStateAction<Vault | undefined>>
  setVaults: Dispatch<SetStateAction<Vault[] | undefined>>
}

const defaultVaultsContextValues: VaultsContextValues = {
  investment: undefined,
  investmentsPerVaults: [],
  isMember: false,
  isInvestmentLoading: false,
  isMemberLoading: false,
  isVaultsLoading: false,
  isVaultDetailsLoading: false,
  vault: undefined,
  vaults: [],
  vaultDetails: undefined,
  vaultsDetails: undefined,
  setVault: () => {},
  setVaults: () => {},
}

const VaultsContext = createContext<VaultsContextValues>(defaultVaultsContextValues)

export const VaultsProvider = ({ children }: { children: ReactNode }) => {
  const [vault, setVault] = useState<Vault | undefined>(undefined)
  const [vaults, setVaults] = useState<Vault[] | undefined>(undefined)
  const { network, shareClass, shareClassId } = usePoolsContext()
  const { data: poolNetworkVaults, isLoading: isPoolVaultsLoading } = useVaults(network, shareClass?.details.id)
  const { data: vaultsDetails, isLoading: isVaultsDetailsLoading } = useVaultsDetails(vaults)
  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault)
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault)
  const { data: investmentsPerVaults, isLoading: isInvestmentsPerVaultsLoading } = useInvestmentsPerVaults(vaults)
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, network?.chainId)

  useEffect(() => {
    if (poolNetworkVaults?.length && (!vault || !poolNetworkVaults.includes(vault))) {
      setVault(poolNetworkVaults[0])
    }

    setVaults(poolNetworkVaults)
  }, [poolNetworkVaults, vault, setVault, setVaults])

  const isVaultsLoading =
    isPoolVaultsLoading ||
    isVaultDetailsLoading ||
    isVaultsDetailsLoading ||
    isInvestmentLoading ||
    isInvestmentsPerVaultsLoading ||
    isMemberLoading

  return (
    <VaultsContext.Provider
      value={{
        investment,
        investmentsPerVaults,
        isMember: isMember ?? false,
        isInvestmentLoading,
        isMemberLoading,
        isVaultsLoading,
        isVaultDetailsLoading,
        vault,
        vaults,
        vaultDetails,
        vaultsDetails,
        setVault,
        setVaults,
      }}
    >
      {children}
    </VaultsContext.Provider>
  )
}

export const useVaultsContext = () => {
  const context = useContext(VaultsContext)
  if (!context || context === defaultVaultsContextValues) {
    throw new Error('useVaultsContext must be used within a VaultsProvider that is in a PoolsProvider')
  }
  return context
}
