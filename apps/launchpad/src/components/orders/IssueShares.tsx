import { formatDate, useCentrifugeTransaction, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Grid, Text, VStack } from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'
import { useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Button, Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { Price } from '@centrifuge/sdk'
import { LiveAmountDisplay } from './LiveAmountDisplay'
import { z } from 'zod'

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const createValidationSchema = () => {
  return z.object({
    orders: z.record(
      z.string(),
      z.object({
        id: z.string(),
        assetId: z.any(),
        chainId: z.number(),
        amount: z.string(),
        isSelected: z.boolean(),
        approvedAt: z.date(),
        pricePerShare: z.string().refine(
          (val) => {
            if (!val.includes('.')) return true
            return val.split('.')[1].length <= 18
          },
          { message: 'Max 18 decimal places' }
        ),
        epoch: z.number(),
      })
    ),
  })
}

export const IssueShares = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const validationSchema = createValidationSchema()

  const orders = useMemo(() => {
    if (!pendingOrders) return []
    return (
      pendingOrders
        .flatMap((order) =>
          order.pendingIssuances.map((r, index) => ({
            chainId: order.chainId,
            amount: r.amount.toFloat().toString(),
            assetId: order.assetId,
            approvedAt: r.approvedAt,
            id: `${order.assetId.toString()}-${r.epoch}-${index}`,
            isSelected: false,
            epoch: r.epoch,
            pricePerShare: shareClassDetails?.pricePerShare?.toDecimal().toString() ?? '0',
          }))
        )
        .filter((o) => o.amount !== '0')
        .sort((a, b) => a.assetId.toString().localeCompare(b.assetId.toString()) || a.epoch - b.epoch) ?? []
    )
  }, [pendingOrders, shareClassDetails?.pricePerShare])

  const ordersByChain = useOrdersByChainId(orders)

  const defaultOrders = useMemo(
    () =>
      orders.reduce((acc, o) => {
        acc[o.id] = { ...o }
        return acc
      }, {} as any),
    [orders]
  )

  const form = useForm({
    defaultValues: { orders: defaultOrders },
    onSubmit: async (data) => {
      const { orders } = data
      const arr = Object.values(orders).filter((o: any) => o.isSelected)
      if (!arr.length || !shareClass) {
        onClose()
        return
      }
      const assets = arr.map((o: any) => ({
        assetId: o.assetId,
        issuePricePerShare: Price.fromFloat(o.pricePerShare),
      }))
      await execute(shareClass.approveDepositsAndIssueShares(assets))
      onClose()
    },
  })

  const { setValue, watch, setError, clearErrors, formState } = form
  const watchedOrders = watch('orders')
  const prevWatchedOrders = usePrevious(watchedOrders)

  useEffect(() => {
    if (!prevWatchedOrders || !watchedOrders) return

    let changed = false
    const newOrders = { ...watchedOrders }

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      const prevOrderState = prevWatchedOrders[order.id]
      const currentOrderState = watchedOrders[order.id]

      if (prevOrderState?.isSelected && !currentOrderState?.isSelected) {
        for (let j = i + 1; j < orders.length; j++) {
          const subsequentOrder = orders[j]
          if (subsequentOrder.assetId.toString() === order.assetId.toString()) {
            if (newOrders[subsequentOrder.id].isSelected) {
              newOrders[subsequentOrder.id].isSelected = false
              changed = true
            }
          }
        }
      }
    }

    if (changed) {
      setValue('orders', newOrders)
    }
  }, [watchedOrders, prevWatchedOrders, orders, setValue])

  useEffect(() => {
    const result = validationSchema.safeParse({ orders: watchedOrders })
    const activeErrors = new Map<string, string>()

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        activeErrors.set(path, issue.message)
      })
    }

    Object.keys(watchedOrders).forEach((id) => {
      const fieldName = `orders.${id}.pricePerShare`
      const orderErrors = formState.errors.orders as any
      const currentError = orderErrors?.[id]?.pricePerShare?.message
      const newError = activeErrors.get(fieldName)

      if (newError && currentError !== newError) {
        setError(fieldName as any, { type: 'manual', message: newError })
      } else if (!newError && currentError) {
        clearErrors(fieldName as any)
      }
    })
  }, [watchedOrders, validationSchema, setError, clearErrors, formState.errors])

  const disabledStates = useMemo(() => {
    const disabledMap: Record<string, boolean> = {}
    for (const order of orders) {
      const assetStr = order.assetId.toString()
      const prevOrder = orders
        .slice()
        .reverse()
        .find((o) => o.assetId.toString() === assetStr && o.epoch < order.epoch)

      if (prevOrder) {
        if (!watchedOrders[prevOrder.id]?.isSelected) {
          disabledMap[order.id] = true
        }
      }
    }
    return disabledMap
  }, [orders, watchedOrders])

  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: 'Approve at',
        accessor: 'approvedAt',
        render: ({ approvedAt }) => <Text>{approvedAt ? formatDate(approvedAt, 'short', true) : '-'}</Text>,
        width: '160px',
      },
      {
        header: 'Issue with NAV per share',
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
        header: `Issue new shares (${shareClassDetails?.symbol})`,
        render: ({ id }: TableData) => (
          <LiveAmountDisplay
            name={`orders.${id}.amount`}
            calculationType="issue"
            pricePerShareName={`orders.${id}.pricePerShare`}
          />
        ),
      },
    ]
  }, [shareClassDetails, setValue])

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
            <OrdersTable
              items={ordersByChain[chainIdNum]}
              shareClass={shareClass}
              extraColumns={extraColumns}
              disabledStates={disabledStates}
            />
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
