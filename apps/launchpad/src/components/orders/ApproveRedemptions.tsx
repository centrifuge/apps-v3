import { useCentrifugeTransaction, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Grid, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { convertBalance, useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Button, Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { AssetId } from '@centrifuge/sdk'
import { LiveAmountDisplay } from './LiveAmountDisplay'

export const ApproveRedemptions = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const orders = useMemo(() => {
    return (
      pendingOrders
        ?.map((order, index) => ({
          chainId: order.chainId,
          amount: order.pendingRedeem.toFloat().toString(),
          assetId: order.assetId,
          id: `${order.assetId.toString()}-${index}`,
        }))
        .filter((order) => order.amount !== '0') ?? []
    )
  }, [pendingOrders])

  const ordersByChain = useOrdersByChainId(orders)

  const defaultOrders = orders.reduce(
    (acc, o) => {
      acc[o.id] = {
        id: o.id,
        assetId: o.assetId,
        chainId: o.chainId,
        amount: o.amount,
        isSelected: false,
        pricePerShare: shareClassDetails?.pricePerShare?.toFloat().toString() ?? '0',
      }
      return acc
    },
    {} as Record<
      string,
      { id: string; assetId: AssetId; chainId: number; amount: string; isSelected: boolean; pricePerShare: string }
    >
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
        return {
          assetId: o.assetId,
          // pool currency decimals
          approveShareAmount: convertBalance(o.amount, poolCurrency?.decimals ?? 18),
        }
      })

      await execute(shareClass.approveRedeemsAndRevokeShares(assets))
      onClose()
    },
  })

  const { setValue } = form

  // @ts-ignore
  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: `Approve amount (${shareClassDetails?.symbol})`,
        accessor: 'newAmount',
        render: ({ id }: { id: string }) => {
          return (
            <BalanceInput
              name={`orders.${id}.amount`}
              buttonLabel="MAX"
              decimals={poolCurrency?.decimals}
              onButtonClick={() => {
                const originalOrder = orders.find((o) => o.id === id)
                if (originalOrder) {
                  setValue(`orders.${id}.amount`, originalOrder.amount)
                }
              }}
            />
          )
        },
      },
      {
        header: 'Estimated payout',
        accessor: 'approvedAmount',
        render: ({ id }: { id: string }) => {
          return (
            <LiveAmountDisplay
              name={`orders.${id}.amount`}
              poolDecimals={poolCurrency?.decimals}
              calculationType="revoke"
              pricePerShareName={`orders.${id}.pricePerShare`}
            />
          )
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
