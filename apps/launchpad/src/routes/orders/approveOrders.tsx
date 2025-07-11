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
  pendingDeposit: Balance
}

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

        {Object.keys(groupedByChain ?? {}).map((chainId, index) => {
          const pendingDeposits = groupedByChain?.[parseInt(chainId)]
          if (!pendingDeposits) return null
          return (
            <Box key={chainId} mt={12} mb={12}>
              <Flex alignItems="center" gap={2} mb={4}>
                <NetworkIcon networkId={parseInt(chainId, 10)} />
                <Heading size="md">{networkToName(parseInt(chainId, 10))} Investments</Heading>
              </Flex>
              <Card>
                {groupedByChain?.[parseInt(chainId)]?.map((pendingDeposit) => {
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
