import { useEffect, useMemo } from 'react'
import { Button, Loader, NetworkIcon } from '@centrifuge/ui'
import { Box, Container, Flex, Grid, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { Form, useForm } from '@centrifuge/forms'
import { networkToName, useCentrifugeTransaction } from '@centrifuge/shared'
import { usePendingAmounts } from '@centrifuge/shared/src/hooks/useShareClass'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AssetId, Balance } from '@centrifuge/sdk'
import { z } from 'zod'
import { FormSection } from './FormSection'

const schema = z.object({
  selectedAssets: z.array(z.instanceof(AssetId)),
  pendingDeposits: z.array(
    z.object({
      chainId: z.number(),
      assetId: z.instanceof(AssetId),
      pendingDeposit: z.instanceof(Balance),
    })
  ),
})

export const ApproveButton = ({
  disabled,
  onClick,
  isLoading,
}: {
  disabled: boolean
  onClick: () => Promise<void>
  isLoading: boolean
}) => {
  return <Button label="Approve" onClick={onClick} size="sm" width={163} disabled={disabled} loading={isLoading} />
}

export default function ApproveOrders() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { isLoading, shareClass } = usePoolProvider()
  const { data: pendingAmounts } = usePendingAmounts(shareClass?.shareClass)

  useEffect(() => {
    setValue(
      'pendingDeposits',
      pendingAmounts?.map((p) => ({
        chainId: p.chainId,
        assetId: p.assetId,
        pendingDeposit: p.pendingDeposit,
      })) ?? []
    )
  }, [pendingAmounts])

  const form = useForm({
    schema,
    defaultValues: {
      selectedAssets: [],
      pendingDeposits: [],
    },
    mode: 'onChange',
    onSubmit: (values) => {
      const { selectedAssets, pendingDeposits } = values

      const payload = selectedAssets
        .map((selectedAssetId) => {
          const pendingInfo = pendingDeposits.find((p) => p.assetId.equals(selectedAssetId))

          if (pendingInfo) {
            return {
              assetId: selectedAssetId,
              approveAssetAmount: pendingInfo.pendingDeposit,
            }
          }
          return null
        })
        .filter(Boolean)

      if (payload.length > 0) {
        execute(shareClass?.shareClass.approveDepositsAndIssueShares(payload))
      }
    },
  })

  const { watch, setValue, getValues } = form

  const selectedAssets = watch('selectedAssets')
  const pendingDeposits = watch('pendingDeposits')

  const handleAssetSelection = (assetId: AssetId, isChecked: boolean) => {
    const currentAssets = getValues('selectedAssets')
    const newAssets = isChecked
      ? [...currentAssets, assetId]
      : currentAssets.filter((a) => a.raw.toString() !== assetId.raw.toString())

    setValue('selectedAssets', newAssets, { shouldDirty: true })
  }

  const totalPendingInvestments = useMemo(() => {
    return pendingAmounts?.map((p) => p.pendingDeposit).reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts])

  const isApproveDisabled = !selectedAssets.length

  if (isLoading) {
    return <Loader />
  }

  if (totalPendingInvestments === 0 || !pendingAmounts?.length) {
    return (
      <VStack mt={10}>
        <Text>No investments to approve</Text>
      </VStack>
    )
  }

  return (
    <Container mt={8}>
      <Form form={form}>
        <Grid templateColumns="1fr 160px" gap={4} alignItems="center">
          <Heading>Approve investments</Heading>
          <ApproveButton disabled={isApproveDisabled} onClick={() => form.handleSubmit()} isLoading={isPending} />
        </Grid>

        {pendingDeposits?.map((pendingDeposit, index) => {
          const innerSections = [
            {
              fieldType: 'balance' as const,
              name: `pendingDeposits.${index}.pendingDeposit`,
              label: 'Approve investments',
              // Todo each pending amount should return the asset currency details
              currency: 'USDC',
              decimals: 2,
              disabled: true,
            },
            {
              fieldType: 'checkbox' as const,
              name: `chain-checkbox-${pendingDeposit.chainId}`,
              label: 'Approve',
              onChange: (checked: boolean) => handleAssetSelection(pendingDeposit.assetId, checked),
            },
          ]

          return (
            <Box key={pendingDeposit.chainId} mt={12} mb={12}>
              <Stack>
                <Flex justifyContent="space-between">
                  <Flex alignItems="center" gap={2}>
                    <NetworkIcon networkId={pendingDeposit.chainId} />
                    <Heading size="md">{networkToName(pendingDeposit.chainId)} Investments</Heading>
                  </Flex>
                </Flex>
                <FormSection fields={innerSections} />
              </Stack>
            </Box>
          )
        })}
        <Flex justifyContent="center">
          <ApproveButton disabled={isApproveDisabled} onClick={() => form.handleSubmit()} isLoading={isPending} />
        </Flex>
      </Form>
    </Container>
  )
}
