import { Vault } from '@centrifuge/sdk'
import { Holdings, networkToName, useHoldings } from '@centrifuge/shared'
import { Flex, Grid, Heading, Stack } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { NetworkIcon, Button } from '@centrifuge/ui'
import { AddVaultModal } from './AddVaultModal'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { HoldingDetailsCard } from './HoldingDetailsCard'

export const VaultList = ({ vaults }: { vaults?: Vault[] }) => {
  const { shareClass } = useSelectedPool()
  const { data: holdings } = useHoldings(shareClass)
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)

  const closeModal = () => {
    setSelectedVault(null)
  }

  const vaultsByChain = useMemo(() => {
    if (!vaults) return {}
    return vaults.reduce((acc: Record<number, Vault[]>, vault) => {
      const { chainId } = vault
      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId].push(vault)
      return acc
    }, {})
  }, [vaults])

  return (
    <>
      {Object.entries(vaultsByChain).map(([chainId, vault]) => {
        const chainIdNumber = Number(chainId)
        const holdingsPerVault = holdings?.filter((holding) => holding.asset.chainId === chainIdNumber)
        return (
          <Stack key={`${chainIdNumber}-${vault}`}>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" gap={2}>
                <NetworkIcon networkId={chainIdNumber} />
                <Heading size="md">{networkToName(chainIdNumber)}</Heading>
              </Flex>
              <Button label="Add vault" colorPalette="yellow" size="sm" onClick={() => setSelectedVault(vault[0])} />
            </Flex>
            <Grid gridTemplateColumns={['1fr', '1fr 1fr 1fr']} gap={2}>
              {holdingsPerVault?.map((holding, index) => (
                <HoldingDetailsCard key={`${holding.asset.address}-${index}`} vault={vault[0]} holding={holding} />
              ))}
            </Grid>
          </Stack>
        )
      })}

      <AddVaultModal
        selectedVault={selectedVault}
        isOpen={!!selectedVault}
        onClose={closeModal}
        holdings={holdings ?? []}
      />
    </>
  )
}
