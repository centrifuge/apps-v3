import { Vault } from '@centrifuge/sdk'
import { networkToName, useVaultDetails, VaultDetails } from '@centrifuge/shared'
import { AssetIconText, Button, Card, NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Separator, Stack } from '@chakra-ui/react'
import { VaultCard } from './VaultCard'
import { useMemo } from 'react'

const VaultDisplayCard = ({
  vault,
  holdingsOnChain,
  onUpdateVault,
}: {
  vault: Vault
  holdingsOnChain: any[]
  onUpdateVault: (data: { vault: Vault; vaultDetails: VaultDetails | null; holding: any }) => void
}) => {
  const { data: vaultDetails, isLoading: isLoadingDetails } = useVaultDetails(vault)

  const holding = useMemo(() => {
    if (!vaultDetails || !holdingsOnChain) return null
    return holdingsOnChain.find((h) => h.asset.address === vaultDetails.investmentCurrency.address)
  }, [vaultDetails, holdingsOnChain])

  if (isLoadingDetails || !holding) {
    return null
  }

  const values = [
    {
      label: 'Currency',
      value: holding.asset.address,
      type: 'address' as const,
    },
    {
      label: 'Type',
      value: vaultDetails?.isSyncInvest ? 'Sync-Invest-ERC-7540' : 'ERC-7540',
    },
    {
      label: 'Deposits',
      value: vaultDetails?.investmentCurrency.symbol ?? '-',
    },
  ]

  return (
    <Card
      _hover={{ boxShadow: 'md', cursor: 'pointer' }}
      tabIndex={0}
      aria-label="Vault card"
      onClick={() =>
        onUpdateVault({
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
}

export const VaultsPerChain = ({
  chainId,
  vaults,
  holdingsByChain,
  onAddVault,
  onUpdateVault,
}: {
  chainId: number
  vaults: Vault[]
  holdingsByChain: Record<number, any[]>
  onAddVault: (vault: Vault) => void
  onUpdateVault: (data: { vault: Vault; vaultDetails: VaultDetails | null; holding: any }) => void
}) => {
  const holdingsOnChain = holdingsByChain[chainId] || []

  return (
    <Stack>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <NetworkIcon networkId={chainId} />
          <Heading size="md">{networkToName(chainId)}</Heading>
        </Flex>
        <Button label="Add vault" colorPalette="yellow" size="sm" onClick={() => onAddVault(vaults[0])} />
      </Flex>

      <Grid gridTemplateColumns="1fr 1fr 1fr" gap={2}>
        {vaults.map((vault) => (
          <VaultDisplayCard
            key={vault.address}
            vault={vault}
            holdingsOnChain={holdingsOnChain}
            onUpdateVault={onUpdateVault}
          />
        ))}
      </Grid>
    </Stack>
  )
}
