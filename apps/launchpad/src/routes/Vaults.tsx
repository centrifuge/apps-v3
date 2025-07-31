import { Loader, VStack } from '@chakra-ui/react'
import { VaultList } from '@components/vaults/VaultList'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useVaultsPerShareClass } from '@centrifuge/shared'

export default function Vaults() {
  const { shareClass, isLoading } = useSelectedPool()
  const { data: vaults, isLoading: isLoadingVaults } = useVaultsPerShareClass(shareClass, { enabled: !!shareClass })

  if (isLoading || isLoadingVaults) {
    return <Loader />
  }

  return <VaultList vaults={vaults} />
}
