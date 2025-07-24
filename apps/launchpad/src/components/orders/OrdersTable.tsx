import { z } from 'zod'
import { useForm, Form, SubmitButton, useWatch } from '@centrifuge/forms'
import { CurrencyDetails, ShareClassWithDetails, useCentrifugeTransaction } from '@centrifuge/shared'
import { usePoolProvider } from '@contexts/PoolProvider'
import { Loader } from '@centrifuge/ui'
import { Container, Flex, Heading } from '@chakra-ui/react'
import { InternalOrdersTable } from './InternalOrdersTable'
import { modeConfig, OrderMode } from './modeConfig'

export default function OrdersTable({ mode }: { mode: OrderMode }) {
  const { shareClass, poolDetails, isLoading } = usePoolProvider()
  const poolCurrency = poolDetails?.currency

  if (!shareClass?.shareClass || isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }

  return <OrdersForm shareClass={shareClass} mode={mode} poolCurrency={poolCurrency} />
}

export const OrdersForm = ({
  mode,
  shareClass,
  poolCurrency,
}: {
  mode: OrderMode
  shareClass: ShareClassWithDetails
  poolCurrency: CurrencyDetails | undefined
}) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const config = modeConfig[mode]

  const onSubmit = (values: { selectedAssets: any[] }) => {
    if (values.selectedAssets.length === 0 || !shareClass?.shareClass) {
      throw new Error('No assets selected or share class not found')
    }
    const assets = values.selectedAssets.map((asset) =>
      config.mapAssets(asset, asset.assetDecimals ?? poolCurrency?.decimals ?? 18)
    )
    execute(config.executeTransaction(shareClass.shareClass, assets))
  }

  const form = useForm({
    defaultValues: { selectedAssets: [] },
    mode: 'onChange',
    onSubmit,
  })

  const watch = useWatch({ control: form.control, name: 'selectedAssets' })
  const isDisabled = watch.length === 0

  if (!shareClass?.shareClass) return <Loader />

  return (
    <Container>
      <Form form={form}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md">{config.headingText}</Heading>
          <SubmitButton
            colorPalette="yellow"
            loading={isPending}
            onSubmit={() => form.handleSubmit()}
            disabled={isDisabled}
          >
            {config.buttonText}
          </SubmitButton>
        </Flex>
        <InternalOrdersTable
          mode={mode}
          shareClass={shareClass.shareClass}
          pricePerShare={shareClass?.details.pricePerShare}
          shareClassSymbol={shareClass?.details.symbol}
        />
      </Form>
    </Container>
  )
}
