import { useEffect, useMemo } from 'react'
import { Button, Loader, NetworkIcon, Card } from '@centrifuge/ui'
import { Box, Container, Flex, Grid, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { Form, useForm } from '@centrifuge/forms'
import { networkToName, useCentrifugeTransaction } from '@centrifuge/shared'
import { usePendingAmounts } from '@centrifuge/shared/src/hooks/useShareClass'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AssetId, Balance } from '@centrifuge/sdk'
import { FormSection } from './FormSection'
import { z } from 'zod'

type PendingAmount = {
  chainId: number
  assetId: AssetId
  pendingRedeem: Balance
}

const schema = z.object({
  selectedAssets: z.array(z.instanceof(AssetId)),
  pendingRedeems: z.array(
    z.object({
      chainId: z.number(),
      assetId: z.instanceof(AssetId),
      pendingRedeem: z.instanceof(Balance),
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

export default function ApproveRedemptions() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { isLoading, shareClass } = usePoolProvider()
  const { data: pendingAmounts } = usePendingAmounts(shareClass?.shareClass!)

  console.log(pendingAmounts)

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
      'pendingRedeems',
      pendingAmounts?.map((p) => ({
        chainId: p.chainId,
        assetId: p.assetId,
        pendingRedeem: p.pendingRedeem,
      })) ?? []
    )
  }, [pendingAmounts])

  const form = useForm({
    schema,
    defaultValues: {
      selectedAssets: [],
      pendingRedeems: [],
    },
    mode: 'onChange',
    onSubmit: (values) => {
      const { selectedAssets, pendingRedeems } = values

      const payload = selectedAssets
        .map((selectedAssetId) => {
          const pendingInfo = pendingRedeems.find((p) => p.assetId.equals(selectedAssetId))

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
                      fieldType: 'balance' as const,
                      name: `pendingRedeems.${index}.pendingRedeem`,
                      label: 'Approve redemption',
                      // Todo each pending amount should return the asset currency details
                      currency: shareClass?.details.symbol ?? '',
                      decimals: 2,
                      disabled: true,
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
          <ApproveButton disabled={isApproveDisabled} onClick={() => form.handleSubmit()} isLoading={isPending} />
        </Flex>
      </Form>
    </Container>
  )
}
