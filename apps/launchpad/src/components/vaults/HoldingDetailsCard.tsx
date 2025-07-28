import { Vault } from '@centrifuge/sdk'
import { formatBalance, Holdings, networkToName, truncateAddress, useVaultDetails } from '@centrifuge/shared'
import { AssetIconText, AssetSymbol, Card, CopyToClipboard, NetworkIcon } from '@centrifuge/ui'
import { Box, DataList, Flex, Grid, Separator, Text } from '@chakra-ui/react'

export const HoldingDetailsCard = ({
  holding,
  onClick,
  vault,
  showExtraValues = false,
}: {
  holding: Holdings[number]
  onClick: () => void
  showExtraValues?: boolean
  vault: Vault
}) => {
  const { data: vaultDetails } = useVaultDetails(vault)
  console.log(holding, vaultDetails)

  const dataListItems = [
    {
      label: 'Address',
      value: (
        <Flex alignItems="center" gap={2}>
          <Text fontSize="sm">{truncateAddress(vault.address, 3)}</Text>
          <CopyToClipboard value={vault.address} variant="plain" size="2xs" />
        </Flex>
      ),
    },
    ...(showExtraValues
      ? [
          {
            label: 'Currency',
            value: <Text fontSize="sm">{holding.asset.symbol}</Text>,
          },
        ]
      : []),
    {
      label: 'Type',
      value: <Text fontSize="sm">{vaultDetails?.isSyncInvest ? 'Sync-Invest-ERC-7540' : 'ERC-7540'}</Text>,
    },
    ...(showExtraValues
      ? [
          {
            label: 'Network',
            value: <Text fontSize="sm">{networkToName(holding.asset.chainId)}</Text>,
          },
        ]
      : []),
  ]

  return (
    <Card _hover={{ cursor: 'pointer', boxShadow: 'md' }} onClick={onClick}>
      <AssetIconText assetSymbol={holding.asset.symbol as AssetSymbol} />
      <Separator my={2} />
      {dataListItems.map((item) => (
        <Flex key={item.label} alignItems="center" my={2}>
          <Text color="gray.500" fontSize="sm" flex={1}>
            {item.label}
          </Text>
          <Box alignSelf="flex-end">{item.value}</Box>
        </Flex>
      ))}
    </Card>
  )
}
