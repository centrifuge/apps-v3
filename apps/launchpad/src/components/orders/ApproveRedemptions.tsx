import { Holdings, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { AssetId, Balance } from '@centrifuge/sdk'
import { LiveAmountDisplay } from './LiveAmountDisplay'

export const ApproveRedemptions = () => {
  const { shareClass, poolCurrency } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const orders = useMemo(() => {
    return (
      pendingOrders
        ?.map((order) => ({
          chainId: order.chainId,
          amount: order.pendingDeposit,
          assetId: order.assetId,
        }))
        .filter((order) => !order.amount.isZero()) ?? []
    )
  }, [pendingOrders])

  const ordersByChain = useOrdersByChainId(orders)

  const form = useForm({
    defaultValues: {
      orders: orders.reduce(
        (acc, order) => {
          const assetIdStr = order.assetId.toString()
          acc[assetIdStr] = {
            assetId: order.assetId,
            amount: order.amount,
            isSelected: false,
          }
          return acc
        },
        {} as Record<string, { assetId: AssetId; amount: Balance; isSelected: boolean }>
      ),
    },
    onSubmit: (data) => {
      const ordersToSubmit = Object.values(data.orders)
        .filter((order) => order.isSelected)
        .map(({ assetId, amount }) => ({ assetId, amount }))

      console.log('Submitting:', ordersToSubmit)
    },
  })

  const { setValue, watch } = form
  const selectedOrders = watch('orders')
  console.log('selectedOrders', selectedOrders)

  // @ts-ignore
  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: 'Approve amount',
        accessor: 'amount',
        render: ({ id, holding }: { id: string; holding: Holdings[number] }) => {
          return (
            <BalanceInput
              name={`orders.${id}.amount`}
              buttonLabel="MAX"
              decimals={holding?.asset?.decimals}
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
        header: `Approve amount (${poolCurrency?.symbol})`,
        accessor: 'amount',
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
    </Form>
  )
}
