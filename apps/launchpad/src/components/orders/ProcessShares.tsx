import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Grid, Text, VStack } from '@chakra-ui/react'
import { useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Button, Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form } from '@centrifuge/forms'
import { LiveAmountDisplay } from './LiveAmountDisplay'
import { formatDate } from '@centrifuge/shared'
import { useShareProcessing } from './useShareProcessing'
import { useMemo } from 'react'

type Props = {
  mode: 'issue' | 'revoke'
  onClose: () => void
}

export const ProcessShares = ({ mode, onClose }: Props) => {
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { form, orders, disabledStates, isPending } = useShareProcessing(mode, onClose)
  const { setValue } = form

  const ordersByChain = useOrdersByChainId(orders)

  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    const navHeader = mode === 'issue' ? 'Issue with NAV per share' : 'Revoke with NAV per share'
    const payoutHeader =
      mode === 'issue' ? `Issue new shares (${shareClassDetails?.symbol})` : `Est. Payout (${poolCurrency?.symbol})`

    return [
      {
        header: 'Approve at',
        accessor: 'approvedAt',
        render: ({ approvedAt }: TableData) => <Text>{approvedAt ? formatDate(approvedAt, 'short', true) : '-'}</Text>,
        width: '160px',
      },
      {
        header: navHeader,
        accessor: 'pricePerShare',
        render: ({ id }: TableData) => (
          <BalanceInput
            name={`orders.${id}.pricePerShare`}
            buttonLabel="Latest"
            decimals={18}
            onButtonClick={() => {
              const latestPrice = shareClassDetails?.pricePerShare?.toDecimal().toString() ?? '0'
              setValue(`orders.${id}.pricePerShare`, latestPrice, { shouldValidate: true })
            }}
          />
        ),
      },
      {
        header: payoutHeader,
        render: ({ id }: TableData) => (
          <LiveAmountDisplay
            name={`orders.${id}.amount`}
            calculationType={mode}
            pricePerShareName={`orders.${id}.pricePerShare`}
          />
        ),
      },
    ]
  }, [mode, shareClassDetails, poolCurrency, setValue])

  if (orders.length === 0) {
    return <VStack>No pending orders</VStack>
  }

  return (
    <Form form={form}>
      {Object.keys(ordersByChain).map((chainId) => (
        <Card key={chainId}>
          <ChainHeader chainId={chainId} />
          <OrdersTable
            items={ordersByChain[parseInt(chainId, 10)]}
            shareClass={shareClass!}
            extraColumns={extraColumns}
            disabledStates={disabledStates}
          />
        </Card>
      ))}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={2} mt={4}>
        <Button size="sm" variant="solid" colorPalette="gray" onClick={onClose} label="Cancel" />
        <Button
          size="sm"
          variant="solid"
          colorPalette="yellow"
          onClick={() => form.handleSubmit()}
          label={mode === 'issue' ? 'Approve' : 'Revoke'}
          loading={isPending}
        />
      </Grid>
    </Form>
  )
}
