import { useMemo } from 'react'
import { Loader, NetworkIcon, Card } from '@centrifuge/ui'
import { Box, Container, Flex, Grid, Heading, Text, VStack } from '@chakra-ui/react'
import { Form, SubmitButton, useForm } from '@centrifuge/forms'
import {
  networkToName,
  useCentrifugeTransaction,
  useGroupPendingAmountsByChain,
  usePendingAmounts,
} from '@centrifuge/shared'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AssetId } from '@centrifuge/sdk'
import { FormSection } from './FormSection'
import { SelectAssetsSchema } from './utils'

export default function ApproveOrders() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { isLoading, shareClass } = usePoolProvider()
  const { data: pendingAmounts = [] } = usePendingAmounts(shareClass?.shareClass!)
  const groupedByChain = useGroupPendingAmountsByChain(pendingAmounts ?? [])

  const form = useForm({
    schema: SelectAssetsSchema,
    defaultValues: {
      selectedAssets: [],
    },
    mode: 'onChange',
    onSubmit: (values) => {
      const { selectedAssets } = values

      const payload = selectedAssets
        .map((selectedAssetId) => {
          const pendingInfo = pendingAmounts.find((p) => p.assetId.equals(selectedAssetId))

          if (pendingInfo) {
            return {
              assetId: selectedAssetId,
              approveAssetAmount: pendingInfo.pendingDeposit,
            }
          }
          return null
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      if (payload.length > 0 && shareClass?.shareClass) {
        execute(shareClass.shareClass.approveDepositsAndIssueShares(payload))
      }
    },
  })

  const { watch, setValue, getValues } = form
  const selectedAssets = watch('selectedAssets')

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
    <Container>
      <Form form={form}>
        <Grid templateColumns="1fr 160px" gap={4} alignItems="center">
          <Heading>Approve investments</Heading>
          <SubmitButton colorPalette="yellow" size="sm" disabled={isApproveDisabled} loading={isPending}>
            Save changes
          </SubmitButton>
        </Grid>

        {Object.keys(groupedByChain ?? {}).map((chainId, index) => {
          const chainIdInt = parseInt(chainId)
          const pendingDeposits = groupedByChain?.[chainIdInt]
          if (!pendingDeposits) return null
          return (
            <Box key={chainId} mt={12} mb={12}>
              <Flex alignItems="center" gap={2} mb={4}>
                <NetworkIcon networkId={chainIdInt} />
                <Heading size="md">{networkToName(chainIdInt)} Investments</Heading>
              </Flex>
              <Card>
                {groupedByChain?.[chainIdInt]?.map((pendingDeposit) => {
                  const innerSections = [
                    {
                      fieldType: 'displayBalance' as const,
                      label: 'Approve investments',
                      // Todo each pending amount should return the asset currency details
                      currency: 'USDC',
                      decimals: 2,
                      balance: pendingDeposit.pendingDeposit,
                    },
                    {
                      fieldType: 'checkbox' as const,
                      name: `chain-checkbox-${pendingDeposit.chainId}`,
                      label: 'Approve',
                      onChange: (checked: boolean) => handleAssetSelection(pendingDeposit.assetId, checked),
                    },
                  ]

                  return <FormSection fields={innerSections} />
                })}
              </Card>
            </Box>
          )
        })}
        <Flex justifyContent="center">
          <SubmitButton colorPalette="yellow" size="sm" disabled={isApproveDisabled} loading={isPending}>
            Save changes
          </SubmitButton>
        </Flex>
      </Form>
    </Container>
  )
}
