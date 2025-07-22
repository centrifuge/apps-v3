import { Vault } from '@centrifuge/sdk'
import { networkToName, useVaultDetails, VaultDetails } from '@centrifuge/shared'
import { AssetIconText, Button, Card, NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Separator, Stack } from '@chakra-ui/react'
import { VaultCard } from './VaultCard'

export const VaultsPerChain = ({
  vault,
  holdingsByChain,
  setIsModalOpen,
  setSelectedVault,
}: {
  vault: Vault | null
  // TODO: fix this type
  holdingsByChain: Record<number, any[]>
  setIsModalOpen: () => void
  setSelectedVault: (vault: { vault: Vault; vaultDetails: VaultDetails | null; holding: any }) => void
}) => {
  const { data: vaultDetails } = useVaultDetails(vault)
  const holdings = vault ? holdingsByChain[vault.chainId] : []

  if (!holdings || !vault) return null

  return (
    <Stack>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <NetworkIcon networkId={vault.chainId} />
          <Heading size="md">{networkToName(vault.chainId)}</Heading>
        </Flex>
        <Button label="Add vault" colorPalette="yellow" size="sm" onClick={setIsModalOpen} />
      </Flex>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gap={2}>
        {holdings?.map((holding) => {
          const values = [
            {
              label: 'Address',
              value: holding.asset.address,
              type: 'address' as const,
            },
            {
              label: 'Type',
              value: 'TBD',
            },
            {
              label: 'Deposits',
              value: 'USD',
            },
          ]
          return (
            <Card
              key={holding.assetId.raw.toString()}
              _hover={{ boxShadow: 'md', cursor: 'pointer' }}
              tabIndex={0}
              aria-label="Vault card"
              onClick={() =>
                setSelectedVault({
                  vault,
                  vaultDetails: vaultDetails || null,
                  holding,
                })
              }
            >
              <AssetIconText assetSymbol={holding.asset.symbol} />
              <Separator my={2} />
              <VaultCard values={values} />
            </Card>
          )
        })}
      </Grid>
    </Stack>
  )
}
