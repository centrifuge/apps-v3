import { z } from 'zod'
import { useForm, Form, SubmitButton, createBalanceSchema } from '@centrifuge/forms'
import { ShareClassWithDetails, useCentrifugeTransaction, useHoldings } from '@centrifuge/shared'
import { usePoolProvider } from '@contexts/PoolProvider'
import { AssetId } from '@centrifuge/sdk'
import { Loader } from '@centrifuge/ui'
import { Container, Flex, Heading } from '@chakra-ui/react'
import { InternalOrdersTable } from './InternalOrdersTable'

type OrderMode = 'approve' | 'issue'

const ApproveAsset = z.object({
  assetId: z.instanceof(AssetId),
  approveAssetAmount: createBalanceSchema(6),
})

const IssueAsset = z.object({
  assetId: z.instanceof(AssetId),
  // Price is always 18 decimals
  issuePricePerShare: createBalanceSchema(18),
})

export default function OrdersTable({ mode }: { mode: OrderMode }) {
  const { shareClass, isLoading } = usePoolProvider()

  if (!shareClass?.shareClass || isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }

  return <OrdersForm shareClass={shareClass} mode={mode} />
}

export const OrdersForm = ({ mode, shareClass }: { mode: OrderMode; shareClass: ShareClassWithDetails }) => {
  const { execute, isPending } = useCentrifugeTransaction()

  const onSubmit = (values: { selectedAssets: any[] }) => {
    if (values.selectedAssets.length === 0 || !shareClass?.shareClass) {
      throw new Error('No assets selected or share class not found')
    }

    let assets
    if (mode === 'approve') {
      assets = values.selectedAssets.map((asset) => ({
        assetId: asset.assetId,
        approveAssetAmount: asset.approveAssetAmount,
      }))

      execute(shareClass.shareClass.approveDepositsAndIssueShares(assets))
    }

    if (mode === 'issue') {
      assets = values.selectedAssets.map((asset) => ({
        assetId: asset.assetId,
        issuePricePerShare: asset.issuePricePerShare,
      }))
      execute(shareClass.shareClass.approveDepositsAndIssueShares(assets))
    }
  }

  const schema = z.object({
    selectedAssets: z.array(mode === 'approve' ? ApproveAsset : IssueAsset),
  })

  const form = useForm({
    schema,
    defaultValues: { selectedAssets: [] },
    mode: 'onChange',
    onSubmit,
  })

  if (!shareClass?.shareClass) return <Loader />

  const headingText = mode === 'approve' ? 'Approve' : 'Issue'
  const buttonText = mode === 'approve' ? 'Approve' : 'Issue'

  return (
    <Container>
      <Form form={form}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md">{headingText}</Heading>
          <SubmitButton colorPalette="yellow" loading={isPending} onSubmit={() => form.handleSubmit()}>
            {buttonText}
          </SubmitButton>
        </Flex>
        <InternalOrdersTable
          mode={mode}
          shareClass={shareClass.shareClass}
          pricePerShare={shareClass?.details.pricePerShare}
        />
      </Form>
    </Container>
  )
}
