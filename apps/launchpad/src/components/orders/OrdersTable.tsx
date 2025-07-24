import { z } from 'zod'
import { useForm, Form, SubmitButton } from '@centrifuge/forms'
import { ShareClassWithDetails, useCentrifugeTransaction } from '@centrifuge/shared'
import { usePoolProvider } from '@contexts/PoolProvider'
import { Loader } from '@centrifuge/ui'
import { Container, Flex, Heading } from '@chakra-ui/react'
import { InternalOrdersTable } from './InternalOrdersTable'
import { modeConfig, OrderMode } from './modeConfig'

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
  const config = modeConfig[mode]

  const onSubmit = (values: { selectedAssets: any[] }) => {
    if (values.selectedAssets.length === 0 || !shareClass?.shareClass) {
      throw new Error('No assets selected or share class not found')
    }

    const assets = values.selectedAssets.map(config.mapAssets as any)
    execute(config.executeTransaction(shareClass.shareClass, assets))
  }

  const schema = z.object({
    selectedAssets: z.array(config.schema),
  })

  const form = useForm({
    schema,
    defaultValues: { selectedAssets: [] },
    mode: 'onChange',
    onSubmit,
  })

  if (!shareClass?.shareClass) return <Loader />

  return (
    <Container>
      <Form form={form}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md">{config.headingText}</Heading>
          <SubmitButton colorPalette="yellow" loading={isPending} onSubmit={() => form.handleSubmit()}>
            {config.buttonText}
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
