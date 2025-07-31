import { Checkbox, Form, useForm } from '@centrifuge/forms'
import { Vault } from '@centrifuge/sdk'
import {
  Holdings,
  networkToName,
  truncateAddress,
  useCentrifugeTransaction,
  usePoolNetworks,
  useVaultDetails,
} from '@centrifuge/shared'
import { AssetIconText, AssetSymbol, Card, CopyToClipboard, Modal } from '@centrifuge/ui'
import { Box, Flex, Separator, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

import { z } from 'zod'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

const CardContent = ({ dataListItems }: { dataListItems: { label: string; value: React.ReactNode }[] }) => {
  return (
    <>
      {dataListItems.map((item) => (
        <Flex key={item.label} alignItems="center" my={2}>
          <Text color="gray.500" fontSize="sm" flex={1}>
            {item.label}
          </Text>
          <Box alignSelf="flex-end">{item.value}</Box>
        </Flex>
      ))}
    </>
  )
}

export const HoldingDetailsCard = ({ holding, vault }: { holding: Holdings[number]; vault: Vault }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass } = useSelectedPool()
  const { data: vaultDetails } = useVaultDetails(vault)
  const { data: networks } = usePoolNetworks(vault.pool.id, { enabled: !!vault.pool.id })

  const form = useForm({
    schema: z.object({
      enabled: z.boolean(),
    }),
    defaultValues: {
      enabled: true,
    },
    onSubmit: (data) => {
      const { enabled } = data
      const network = networks?.find((network) => network.chainId === vault.chainId)

      if (!network) throw new Error('Network not found')

      if (!shareClass) throw new Error('Share class not found')

      execute(network.disableVaults([{ shareClassId: shareClass.id, assetId: vault.assetId }]))
    },
  })

  const shortView = useMemo(() => {
    return [
      {
        label: 'Address',
        value: (
          <Flex alignItems="center" gap={2}>
            <Text fontSize="sm">{truncateAddress(vault.address, 3)}</Text>
            <CopyToClipboard value={vault.address} variant="plain" size="2xs" />
          </Flex>
        ),
      },
      {
        label: 'Currency',
        value: <Text fontSize="sm">{holding.asset.symbol}</Text>,
      },
    ]
  }, [vault, holding])

  const detailedView = useMemo(() => {
    return [
      {
        label: 'Vault',
        value: <Checkbox name="enabled" label="Enabled" />,
      },
      ...shortView,
      {
        label: 'Type',
        value: <Text fontSize="sm">{vaultDetails?.isSyncInvest ? 'Sync-Invest-ERC-7540' : 'ERC-7540'}</Text>,
      },

      {
        label: 'Network',
        value: <Text fontSize="sm">{networkToName(holding.asset.chainId)}</Text>,
      },
    ]
  }, [vault, holding])

  return (
    <Form form={form}>
      <Card _hover={{ cursor: 'pointer', boxShadow: 'md' }} onClick={() => setModalOpen(true)}>
        <AssetIconText assetSymbol={holding.asset.symbol as AssetSymbol} />
        <Separator my={2} />
        <CardContent dataListItems={shortView} />
      </Card>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update Vault"
        onPrimaryAction={() => form.handleSubmit()}
        primaryActionText="Update"
        isPrimaryActionLoading={isPending}
      >
        <CardContent dataListItems={detailedView} />
      </Modal>
    </Form>
  )
}
