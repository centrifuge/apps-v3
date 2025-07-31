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

export const RevokeShares = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const orders = useMemo(() => {
    if (!pendingOrders) {
      return []
    }

    return pendingOrders.flatMap((order, index) => {
      return order.pendingRevocations.map((revocation) => ({
        assetId: order.assetId,
        chainId: order.chainId,
        approvedAt: revocation.approvedAt,
        pricePerShare: shareClassDetails?.pricePerShare?.toFloat().toString() ?? '0',
        epoch: revocation.epoch,
        amount: revocation.amount.toFloat().toString(),
        id: `${order.assetId.toString()}-${index}`,
        isSelected: false,
      }))
    })
  }, [pendingOrders, shareClassDetails])

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
        epoch: number
        pricePerShare: string
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
          // revokePricePerShare: new Price(convertBalance(o.pricePerShare, poolCurrency?.decimals ?? 18).toString()),
        }
      })

      console.log(assets)

      await execute(shareClass.approveRedeemsAndRevokeShares(assets))
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
        header: 'Revoke with NAV per share',
        accessor: 'pricePerShare',
        render: ({ id, epoch }: TableData & { epoch: number }) => {
          // Disable the input if its epoch is greater than the first unapproved one.
          // An already approved item should never be disabled.

          const isDisabled = epoch > lowestEpoch

          console.log(epoch, lowestEpoch)

          return (
            <BalanceInput
              name={`orders.${id}.pricePerShare`}
              disabled={isDisabled}
              buttonLabel="Latest"
              onButtonClick={() => {
                const originalOrder = orders.find((o) => o.id === id)
                const raw = shareClassDetails?.pricePerShare?.toFloat().toString() ?? '0'
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
  }, [orders, setValue, shareClassDetails, poolCurrency?.decimals, lowestEpoch])

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
