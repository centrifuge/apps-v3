import { useMemo } from 'react'
import { Loader, NetworkIcon, Card } from '@centrifuge/ui'
import { Box, Container, Flex, Grid, Heading, Text, VStack } from '@chakra-ui/react'
import { Form, SubmitButton, useForm } from '@centrifuge/forms'
import {
  useGroupPendingAmountsByChain,
  usePendingAmounts,
  useCentrifugeTransaction,
  networkToName,
} from '@centrifuge/shared'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AssetId } from '@centrifuge/sdk'
import { FormSection } from './FormSection'
import { SelectAssetsSchema } from './utils'

export default function ApproveRedemptions() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { isLoading, shareClass } = usePoolProvider()
  const { data: pendingAmounts } = usePendingAmounts(shareClass?.shareClass!)
  const filteredPendingRedeems = pendingAmounts?.filter((p) => p.pendingRedeem.toFloat() > 0)
  const groupedByChain = useGroupPendingAmountsByChain(filteredPendingRedeems ?? [])

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
          const pendingInfo = pendingAmounts?.find((p) => p.assetId.equals(selectedAssetId))

          if (pendingInfo) {
            return {
              assetId: selectedAssetId,
              approveShareAmount: pendingInfo.pendingRedeem,
            }
          }
          return null
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      if (payload.length > 0 && shareClass?.shareClass) {
        execute(shareClass.shareClass.approveRedeemsAndRevokeShares(payload))
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

  const totalPendingRedeems = useMemo(() => {
    return pendingAmounts?.map((p) => p.pendingRedeem).reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts])

  const isApproveDisabled = !selectedAssets.length

  if (isLoading) {
    return <Loader />
  }

  if (totalPendingRedeems === 0 || !pendingAmounts?.length) {
    return (
      <VStack mt={10}>
        <Text>No pending redemptions to approve</Text>
      </VStack>
    )
  }

  return (
    <Container mt={8}>
      <Form form={form}>
        <Grid templateColumns="1fr 160px" gap={4} alignItems="center">
          <Heading>Approve redemptions</Heading>
          <SubmitButton colorPalette="yellow" size="sm" disabled={isApproveDisabled} loading={isPending}>
            Save changes
          </SubmitButton>
        </Grid>

        {Object.keys(groupedByChain ?? {}).map((chainId, index) => {
          const pendingRedeems = groupedByChain?.[parseInt(chainId)]
          if (!pendingRedeems) return null
          return (
            <Box key={chainId} mt={12} mb={12}>
              <Flex alignItems="center" gap={2} mb={4}>
                <NetworkIcon networkId={parseInt(chainId, 10)} />
                <Heading size="md">{networkToName(parseInt(chainId, 10))} Redemptions</Heading>
              </Flex>
              <Card>
                {groupedByChain?.[parseInt(chainId)]?.map((pendingRedeem) => {
                  const innerSections = [
                    {
                      fieldType: 'displayBalance' as const,
                      label: 'Approve redemption',
                      // Todo each pending amount should return the asset currency details
                      currency: shareClass?.details.symbol ?? '',
                      decimals: 2,
                      balance: pendingRedeem.pendingRedeem,
                    },
                    {
                      fieldType: 'checkbox' as const,
                      name: `chain-checkbox-${pendingRedeem.chainId}`,
                      label: 'Approve',
                      onChange: (checked: boolean) => handleAssetSelection(pendingRedeem.assetId, checked),
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
