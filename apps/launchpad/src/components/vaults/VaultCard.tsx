import { Balance, HexString, Vault } from '@centrifuge/sdk'
import { formatUIBalance, networkToName, truncateAddress } from '@centrifuge/shared'
import { AssetIconText, Button, Card, NetworkIcon } from '@centrifuge/ui'
import CopyToClipboard from '@centrifuge/ui/src/components/elements/CopyToClipboard'
import Modal from '@centrifuge/ui/src/components/elements/Modal'
import { Flex, Grid, Heading, Separator, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'

const GridSystem = ({
  label,
  value,
  type,
}: {
  label: string
  value: string | number | Balance | HexString
  type?: 'balance' | 'address'
}) => {
  const structuredValue = (): string | null => {
    if (type === 'balance') {
      return formatUIBalance(value).toString()
    }
    if (type === 'address') {
      return truncateAddress(value as HexString, 3, 3)
    }

    return String(value)
  }

  return (
    <Grid gridTemplateColumns="1fr 1fr" gap={2} alignItems="center">
      <Text color="text-secondary" fontWeight={500} fontSize="sm">
        {label}
      </Text>
      <Flex alignItems="center" justifyContent="flex-end" marginRight={type === 'address' ? '-12px' : '0'}>
        <Text>{structuredValue()}</Text>
        {type === 'address' && <CopyToClipboard value={value as string} />}
      </Flex>
    </Grid>
  )
}

export default function VaultCard({
  vault,
  holdingsByChain,
}: {
  vault: Vault
  // TODO: fix this type
  holdingsByChain: Record<number, any[]>
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const holdings = holdingsByChain[vault.chainId]

  if (!holdings) return null

  return (
    <Stack>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <NetworkIcon networkId={vault.chainId} />
          <Heading size="md">{networkToName(vault.chainId)}</Heading>
        </Flex>
        <Button label="Add vault" colorPalette="yellow" size="sm" onClick={() => setIsModalOpen(true)} />
      </Flex>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gap={2}>
        {holdings?.map((holding) => (
          <Card key={holding.assetId.raw.toString()}>
            <AssetIconText assetSymbol={holding.asset.symbol} />
            <Separator my={2} />
            <GridSystem label="Address" value={holding.asset.address} type="address" />
            <GridSystem label="Type" value="TBD" />
            <GridSystem label="Deposits" value="USD" />
          </Card>
        ))}
      </Grid>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add vault">
        <Text>Add vault</Text>
      </Modal>
    </Stack>
  )
}
