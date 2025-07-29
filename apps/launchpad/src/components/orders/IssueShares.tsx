import { formatDate, useCentrifugeTransaction, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Grid, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { convertBalance, useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Button, Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { AssetId, Price } from '@centrifuge/sdk'
import { LiveAmountDisplay } from './LiveAmountDisplay'

export const IssueShares = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const orders = useMemo(
    () =>
      pendingOrders
        ?.flatMap((order) =>
          order.pendingIssuances.map((r) => ({
            chainId: order.chainId,
            amount: r.amount,
            assetId: order.assetId,
            approvedAt: r.approvedAt,
          }))
        )
        .filter((o) => !o.amount.isZero()) ?? [],
    [pendingOrders]
  )

  const ordersByChain = useOrdersByChainId(orders)

  const defaultOrders = orders.reduce(
    (acc, o) => {
      acc[o.assetId.toString()] = {
        assetId: o.assetId,
        chainId: o.chainId,
        amount: shareClassDetails?.pricePerShare ?? new Price(0),
        isSelected: false,
        approvedAt: o.approvedAt,
      }
      return acc
    },
    {} as Record<string, { assetId: AssetId; chainId: number; amount: Price; isSelected: boolean; approvedAt: Date }>
  )

  const form = useForm({
    defaultValues: { orders: defaultOrders },
    onSubmit: async (data) => {
      const { orders } = data
      const arr = Object.values(orders).filter((o) => o.isSelected)

      if (!arr.length || !shareClass) {
        onClose()
        return
      }

      const assets = arr.map((o) => {
        const balance = typeof o.amount !== 'string' ? o.amount.toString() : o.amount
        return {
          assetId: o.assetId,
          issuePricePerShare: new Price(convertBalance(balance, poolCurrency?.decimals ?? 18).toString()),
        }
      })

      await execute(shareClass.approveDepositsAndIssueShares(assets))
      onClose()
    },
  })

  const { setValue } = form

  // @ts-ignore
  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: 'Approve at',
        accessor: 'approvedAt',
        render: ({ approvedAt }) => {
          return <Text>{approvedAt ? formatDate(approvedAt, 'short', true) : '-'}</Text>
        },
        width: '160px',
      },
      {
        header: 'Issue with NAV per share',
        accessor: 'newAmount',
        render: ({ id }: { id: string }) => {
          return (
            <BalanceInput
              name={`orders.${id}.amount`}
              buttonLabel="MAX"
              decimals={poolCurrency?.decimals}
              onButtonClick={() => {
                const originalOrder = orders.find((o) => o.assetId.toString() === id)
                if (originalOrder) {
                  setValue(`orders.${id}.amount`, originalOrder.amount, {
                    shouldDirty: true,
                  })
                }
              }}
            />
          )
        },
      },
      {
        header: `Issue new shares (${shareClassDetails?.symbol})`,
        accessor: 'approvedAmount',
        render: ({ id }: { id: string }) => {
          return <LiveAmountDisplay name={`orders.${id}.amount`} poolDecimals={poolCurrency?.decimals} />
        },
      },
    ]
  }, [orders, setValue])

  if (!pendingOrders || !shareClass || orders.length === 0) {
    return <VStack>No pending orders</VStack>
  }

  return (
    <Form form={form}>
      {Object.keys(ordersByChain).map((chainId) => {
        const chainIdNum = parseInt(chainId, 10)
        return (
          <Card key={chainId}>
            <ChainHeader chainId={chainId} />
            <OrdersTable items={ordersByChain[chainIdNum]} shareClass={shareClass} extraColumns={extraColumns} />
          </Card>
        )
      })}
      <Grid templateColumns={'1fr 1fr'} gap={2} mt={4}>
        <Button size="sm" variant="solid" colorPalette="gray" onClick={onClose} label="Cancel" />
        <Button
          size="sm"
          variant="solid"
          colorPalette="yellow"
          onClick={() => form.handleSubmit()}
          label="Approve"
          loading={isPending}
        />
      </Grid>
    </Form>
  )
}
