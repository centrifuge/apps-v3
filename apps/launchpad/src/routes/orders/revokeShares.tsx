import { useEffect, useMemo } from 'react'
import { Button, Loader, NetworkIcon, Card } from '@centrifuge/ui'
import { Box, Container, Flex, Grid, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { Form, useForm } from '@centrifuge/forms'
import { networkToName, useCentrifugeTransaction } from '@centrifuge/shared'
import { usePendingAmounts } from '@centrifuge/shared/src/hooks/useShareClass'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AssetId, Balance, Price } from '@centrifuge/sdk'
import { FormSection } from './FormSection'
import { z } from 'zod'

type PendingAmount = {
  chainId: number
  assetId: AssetId
  approvedRedeem: Balance
}

const schema = z.object({
  selectedAssets: z.array(z.instanceof(AssetId)),
  approvedRedeems: z.array(
    z.object({
      chainId: z.number(),
      assetId: z.instanceof(AssetId),
      approvedRedeem: z.instanceof(Balance),
      navPerShare: z.string(),
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

export default function RevokeShares() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { isLoading, shareClass, poolDetails } = usePoolProvider()
  const { data: pendingAmounts } = usePendingAmounts(shareClass?.shareClass!)
  const pricePerShare = shareClass?.details.pricePerShare.toFloat()
  const poolSymbol = poolDetails?.currency.symbol
  const poolDecimals = poolDetails?.currency.decimals

  const groupedByChain = useMemo(() => {
    return pendingAmounts?.reduce(
      (acc, curr) => {
        acc[curr.chainId] = [...(acc[curr.chainId] || []), curr]
        return acc
      },
      {} as Record<number, PendingAmount[]>
    )
  }, [pendingAmounts])

  useEffect(() => {
    setValue(
      'approvedRedeems',
      pendingAmounts?.map((p) => ({
        chainId: p.chainId,
        assetId: p.assetId,
        approvedRedeem: p.approvedRedeem,
        // TODO: should the nav per share come from the sdk as the time the investment was approved, right now is showing the current nav per share
        navPerShare: pricePerShare?.toString() ?? '0',
      })) ?? []
    )
  }, [pendingAmounts])

  const form = useForm({
    schema,
    defaultValues: {
      selectedAssets: [],
      approvedRedeems: [],
    },
    mode: 'onChange',
    onSubmit: (values) => {
      const { selectedAssets, approvedRedeems } = values

      const payload = selectedAssets
        .map((selectedAssetId) => {
          const pendingInfo = approvedRedeems.find((p) => p.assetId.equals(selectedAssetId))

          if (pendingInfo && poolDecimals) {
            return {
              assetId: selectedAssetId,
              revokePricePerShare: new Price(pendingInfo.navPerShare),
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

  const totalApprovedRedeems = useMemo(() => {
    return pendingAmounts?.map((p) => p.approvedRedeem).reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts])

  const isApproveDisabled = !selectedAssets.length

  if (isLoading) {
    return <Loader />
  }

  if (totalApprovedRedeems === 0 || !pendingAmounts?.length) {
    return (
      <VStack mt={10}>
        <Text>No pending shares to revoke</Text>
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

        {Object.keys(groupedByChain ?? {}).map((chainId, index) => {
          const approvedRedeems = groupedByChain?.[parseInt(chainId)]
          if (!approvedRedeems) return null
          return (
            <Box key={chainId} mt={12} mb={12}>
              <Flex alignItems="center" gap={2} mb={4}>
                <NetworkIcon networkId={parseInt(chainId, 10)} />
                <Heading size="md">{networkToName(parseInt(chainId, 10))} Investments</Heading>
              </Flex>
              <Card>
                {groupedByChain?.[parseInt(chainId)]?.map((approvedRedeem) => {
                  const innerSections = [
                    {
                      fieldType: 'balance' as const,
                      name: `approvedRedeems.${index}.navPerShare`,
                      label: 'Revoke with nav per share',
                      subLabel: '(latest)',
                      // Todo each pending amount should return the asset currency details
                      currency: poolSymbol ?? 'USD',
                      decimals: 2,
                    },
                    {
                      fieldType: 'balance' as const,
                      name: `approvedRedeems.${index}.approvedRedeem`,
                      label: 'Revoke shares',
                      currency: shareClass?.details.symbol ?? '',
                      decimals: 2,
                      disabled: true,
                    },
                    {
                      fieldType: 'checkbox' as const,
                      name: `chain-checkbox-${approvedRedeem.chainId}`,
                      label: 'Issue',
                      onChange: (checked: boolean) => handleAssetSelection(approvedRedeem.assetId, checked),
                    },
                  ]

                  return (
                    <FormSection
                      fields={innerSections}
                      templateColumns="1fr 1fr 1fr"
                      key={approvedRedeem.assetId.toString()}
                    />
                  )
                })}
              </Card>
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
