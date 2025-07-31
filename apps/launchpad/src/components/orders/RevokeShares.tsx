import { formatDate, useCentrifugeTransaction, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Grid, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { convertBalance, useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Button, Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { AssetId, Balance, Price } from '@centrifuge/sdk'
import { LiveAmountDisplay } from './LiveAmountDisplay'

export const RevokeShares = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  console.log(pendingOrders)

  const orders = useMemo(() => {
    if (!pendingOrders) return []

    const flatOrders =
      pendingOrders
        ?.flatMap((order) =>
          order.pendingRevocations.map((r) => ({
            chainId: order.chainId,
            amount: r.amount,
            assetId: order.assetId,
            approvedAt: r.approvedAt,
            epoch: r.epoch,
          }))
        )
        .filter((o) => !o.amount.isZero()) ?? []

    const orderGroups = flatOrders.reduce(
      (acc, order) => {
        const key = order.assetId.toString()

        if (!acc[key]) {
          acc[key] = {
            assetId: order.assetId,
            chainId: order.chainId,
            amount: order.amount,
            subOrders: [order],
            approvedAt: order.approvedAt,
            epoch: order.epoch,
          }
        } else {
          acc[key].amount = acc[key].amount.add(order.amount)
          acc[key].subOrders.push(order)
        }
        return acc
      },
      {} as Record<string, any>
    )

    return Object.values(orderGroups)
  }, [pendingOrders])

  const ordersByChain = useOrdersByChainId(orders)

  const defaultOrders = orders.reduce(
    (acc, o) => {
      acc[o.assetId.toString()] = {
        assetId: o.assetId,
        chainId: o.chainId,
        amount: o.amount,
        isSelected: false,
        approvedAt: o.approvedAt,
        pricePerShare: shareClassDetails?.pricePerShare?.toFloat() ?? 0,
      }
      return acc
    },
    {} as Record<
      string,
      {
        assetId: AssetId
        chainId: number
        amount: Balance
        isSelected: boolean
        approvedAt: Date
        pricePerShare: number
      }
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
          revokePricePerShare: new Price(convertBalance(o.pricePerShare, poolCurrency?.decimals ?? 18).toString()),
        }
      })

      await execute(shareClass.approveRedeemsAndRevokeShares(assets))
      onClose()
    },
  })

  const { setValue } = form

  // @ts-ignore
  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    // Find the epoch number of the first order that is not yet approved.
    const firstUnapprovedEpoch = orders.reduce(
      (earliest, order) => (order.epoch < earliest ? order.epoch : earliest),
      Infinity
    )

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
        header: 'Revoke with NAV per share',
        accessor: 'pricePerShare',
        render: ({ id, epoch, approvedAt }: TableData & { epoch: number }) => {
          // Disable the input if its epoch is greater than the first unapproved one.
          // An already approved item should never be disabled.
          const isDisabled = !approvedAt && epoch > firstUnapprovedEpoch

          return (
            <BalanceInput
              name={`orders.${id}.pricePerShare`}
              disabled={isDisabled}
              buttonLabel="Latest"
              onButtonClick={() => {
                const originalOrder = orders.find((o) => o.assetId.toString() === id)
                const raw = shareClassDetails?.pricePerShare?.toFloat() ?? 0
                if (originalOrder) {
                  setValue(`orders.${id}.pricePerShare`, raw)
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
          return (
            <LiveAmountDisplay
              name={`orders.${id}.amount`}
              poolDecimals={poolCurrency?.decimals}
              calculationType="issue"
              pricePerShareName={`orders.${id}.pricePerShare`}
            />
          )
        },
      },
    ]
  }, [orders, setValue, shareClassDetails, poolCurrency?.decimals])

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
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={2} mt={4}>
        <Button size="sm" variant="solid" colorPalette="gray" onClick={onClose} label="Cancel" />
        <Button
          size="sm"
          variant="solid"
          colorPalette="yellow"
          onClick={() => form.handleSubmit()}
          label="Revoke"
          loading={isPending}
        />
      </Grid>
    </Form>
  )
}
