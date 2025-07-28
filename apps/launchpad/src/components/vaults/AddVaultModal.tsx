import { Vault } from '@centrifuge/sdk'
import { AssetIconText, AssetSymbol, Modal } from '@centrifuge/ui'
import { vaultTypes } from './utils'
import {
  Holdings,
  networkToName,
  useCentrifugeTransaction,
  usePoolNetworks,
  useRestrictionHooks,
} from '@centrifuge/shared'
import { Flex, Grid, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Form, Select, useForm } from '@centrifuge/forms'

import { z } from 'zod'
import { useMemo } from 'react'

export const AddVaultModal = ({
  selectedVault,
  isOpen,
  onClose,
  holdings,
}: {
  selectedVault: Vault | null
  isOpen: boolean
  onClose: () => void
  holdings: Holdings
}) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolId } = useSelectedPool()
  const { data: restrictionHooks } = useRestrictionHooks(selectedVault?.chainId ?? 1)
  const { data: networks } = usePoolNetworks(poolId, { enabled: !!poolId })

  const shareClasses = useMemo(() => {
    if (!shareClass || !restrictionHooks) return []
    return [{ id: shareClass.id, hook: restrictionHooks.fullRestrictionsHook }]
  }, [shareClass, restrictionHooks])

  const form = useForm({
    schema: z.object({
      currency: z.string().min(1, { message: 'Currency is required' }),
      type: z.string().min(1, { message: 'Type is required' }),
    }),
    onSubmit: (data) => {
      const { currency, type } = data
      const assetId = holdings?.find((holding) => holding.assetId.raw.toString() === currency)?.assetId
      const network = networks?.find((network) => network.chainId === selectedVault?.chainId)

      if (!network || !shareClasses || !assetId || !shareClass?.id) {
        throw new Error('Network or asset not found')
      }

      const vaults = [
        {
          shareClassId: shareClass.id,
          assetId,
          kind: type as 'async' | 'syncDeposit',
        },
      ]

      execute(network.deploy(shareClasses, vaults))
    },
  })

  const holdingsOnChain = holdings?.filter((holding) => holding.asset.chainId === selectedVault?.chainId)

  const currencyItems = holdingsOnChain?.map((holding) => ({
    label: holding.asset.symbol ?? '',
    value: holding.assetId.toString() ?? '',
    children: (
      <Flex alignItems="center" gap={2}>
        <Text fontWeight={500}>{holding.asset.symbol} on </Text>
        <AssetIconText assetSymbol={holding?.asset.symbol as AssetSymbol} boxSize="16px" />
      </Flex>
    ),
  }))

  if (!selectedVault) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add vault on ${networkToName(selectedVault.chainId)}`}
      onPrimaryAction={() => form.handleSubmit()}
      isPrimaryActionDisabled={!form.formState.isValid}
      isPrimaryActionLoading={isPending}
    >
      <Form form={form}>
        <Grid templateColumns="1fr" gap={4}>
          <Select name="currency" items={currencyItems ?? []} label="Currency" />
          <Select name="type" items={vaultTypes} label="Type" disabled={!currencyItems} />
        </Grid>
      </Form>
    </Modal>
  )
}
