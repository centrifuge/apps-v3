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

export const IssueShares = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const orders = useMemo(() => {
    if (!pendingOrders) {
      return []
    }

    return (
      pendingOrders
        ?.flatMap((order) =>
          order.pendingIssuances.map((r, index) => ({
            chainId: order.chainId,
            amount: r.amount.toFloat().toString(),
            assetId: order.assetId,
            approvedAt: r.approvedAt,
            id: `${order.assetId.toString()}-${index}`,
            isSelected: false,
            epoch: r.epoch,
            pricePerShare: shareClassDetails?.pricePerShare?.toFloat().toString() ?? '0',
          }))
        )
        .filter((o) => o.amount !== '0') ?? []
    )
  }, [pendingOrders])

  const ordersByChain = useOrdersByChainId(orders)

  const defaultOrders = orders.reduce(
    (acc, o) => {
      acc[o.id] = {
        ...o,
      }
      return acc
    },
    {} as Record<
      string,
      {
        assetId: AssetId
        chainId: number
        amount: string
        isSelected: boolean
        approvedAt: Date
        pricePerShare: string
        epoch: number
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
          issuePricePerShare: new Price(convertBalance(o.pricePerShare, poolCurrency?.decimals ?? 18).toString()),
        }
      })

      await execute(shareClass.approveDepositsAndIssueShares(assets))
      onClose()
    },
  })

  const { setValue } = form

  const lowestEpoch = Math.min(...orders.map((o) => o.epoch))

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
        accessor: 'pricePerShare',
        render: ({ id, epoch }: TableData & { epoch: number }) => {
          const isDisabled = epoch > lowestEpoch
          return (
            <BalanceInput
              name={`orders.${id}.pricePerShare`}
              buttonLabel="Latest"
              onButtonClick={() => {
                const originalOrder = orders.find((o) => o.id === id)
                const raw = shareClassDetails?.pricePerShare?.toFloat().toString() ?? '0'
                if (originalOrder) {
                  setValue(`orders.${id}.pricePerShare`, raw)
                }
              }}
              disabled={isDisabled}
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
  }, [orders, setValue, lowestEpoch])

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
          label="Approve"
          loading={isPending}
        />
      </Grid>
    </Form>
  )
}
