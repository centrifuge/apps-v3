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
import { AssetId, Balance, Price } from '@centrifuge/sdk'
import { FormSection } from './FormSection'
import { z } from 'zod'
import { SelectAssetsSchema } from './utils'

const schema = z.object({
  ...SelectAssetsSchema.shape,
  approvedDeposits: z.array(
    z.object({
      chainId: z.number(),
      assetId: z.instanceof(AssetId),
      approvedDeposit: z.instanceof(Balance),
      navPerShare: z.string(),
    })
  ),
})

export default function IssueOrders() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { isLoading, shareClass, poolDetails } = usePoolProvider()
  const { data: pendingAmounts, isLoading: isPendingAmountsLoading } = usePendingAmounts(shareClass?.shareClass!)
  // TODO: it does exist?
  // @ts-ignore
  const filteredPendingDeposits = pendingAmounts?.filter((p) => p.approvedDeposit.toFloat() > 0)
  // TODO: it does exist?
  // @ts-ignore
  const groupedByChain = useGroupPendingAmountsByChain(filteredPendingDeposits ?? [])
  const pricePerShare = shareClass?.details.pricePerShare.toFloat()
  const poolDecimals = poolDetails?.currency.decimals

  const form = useForm({
    schema,
    defaultValues: {
      selectedAssets: [],
      approvedDeposits: [],
    },
    mode: 'onChange',
    onSubmit: (values) => {
      const { selectedAssets, approvedDeposits } = values

      const payload = selectedAssets
        .map((selectedAssetId) => {
          const pendingInfo = approvedDeposits.find((p) => p.assetId.equals(selectedAssetId))

          if (pendingInfo) {
            return {
              assetId: selectedAssetId,
              issuePricePerShare: new Price(pendingInfo.navPerShare),
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

  useMemo(() => {
    setValue(
      'approvedDeposits',
      pendingAmounts?.map((p) => ({
        chainId: p.chainId,
        assetId: p.assetId,
        // TODO: it does exist?
        // @ts-ignore
        approvedDeposit: p.approvedDeposit,
        navPerShare: pricePerShare?.toString() ?? '0',
      })) ?? []
    )
  }, [pendingAmounts])

  const handleAssetSelection = (assetId: AssetId, isChecked: boolean) => {
    const currentAssets = getValues('selectedAssets')
    const newAssets = isChecked
      ? [...currentAssets, assetId]
      : currentAssets.filter((a) => a.raw.toString() !== assetId.raw.toString())

    setValue('selectedAssets', newAssets, { shouldDirty: true })
  }

  const totalApprovedInvestments = useMemo(() => {
    // TODO: it does exist?
    // @ts-ignore
    return pendingAmounts?.map((p) => p.approvedDeposit).reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts])

  const isApproveDisabled = selectedAssets.length === 0

  if (isLoading || isPendingAmountsLoading) {
    return <Loader />
  }

  if (totalApprovedInvestments === 0 || !pendingAmounts?.length) {
    return (
      <VStack mt={10}>
        <Text>No pending shares to issue</Text>
      </VStack>
    )
  }

  return (
    <Container>
      <Form form={form}>
        <Grid templateColumns="1fr 160px" gap={4} alignItems="center">
          <Heading>Issue shares</Heading>
          <SubmitButton colorPalette="yellow" size="sm" disabled={isApproveDisabled} loading={isPending}>
            Save changes
          </SubmitButton>
        </Grid>

        {Object.keys(groupedByChain ?? {}).map((chainId) => {
          const pendingDeposits = groupedByChain?.[parseInt(chainId)]
          if (!pendingDeposits) return null
          return (
            <Box key={chainId} mt={12} mb={12}>
              <Flex alignItems="center" gap={2} mb={4}>
                <NetworkIcon networkId={parseInt(chainId, 10)} />
                <Heading size="md">{networkToName(parseInt(chainId, 10))} Investments</Heading>
              </Flex>
              <Card>
                {groupedByChain?.[parseInt(chainId)]?.map((approvedDeposit, index) => {
                  const innerSections = [
                    {
                      fieldType: 'balance' as const,
                      name: `approvedDeposits.${index}.navPerShare`,
                      label: 'Issue with nav per share',
                      // Todo each pending amount should return the asset currency details
                      currency: index === 0 ? 'USDC' : 'USDT',
                      decimals: poolDecimals ?? 18,
                      buttonLabel: 'Latest',
                    },
                    {
                      fieldType: 'balance' as const,
                      name: `approvedDeposits.${index}.approvedDeposit`,
                      label: 'Issue new shares',
                      currency: shareClass?.details.symbol ?? '',
                      decimals: 2,
                      disabled: true,
                    },
                    {
                      fieldType: 'checkbox' as const,
                      name: `chain-checkbox-${approvedDeposit.chainId}`,
                      label: 'Issue',
                      onChange: (checked: boolean) => handleAssetSelection(approvedDeposit.assetId, checked),
                    },
                  ]

                  return (
                    <FormSection
                      fields={innerSections}
                      templateColumns="1fr 1fr 1fr"
                      key={approvedDeposit.assetId.toString()}
                    />
                  )
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
