import { useCentrifugeTransaction, useHoldings, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Grid, VStack } from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'
import { convertBalance, useOrdersByChainId } from './utils'
import { ChainHeader } from './ChainHeader'
import { Button, Card, ColumnDefinition } from '@centrifuge/ui'
import { OrdersTable, TableData } from './OrdersTable'
import { BalanceInput, Form, useForm } from '@centrifuge/forms'
import { AssetId, Balance } from '@centrifuge/sdk'
import { z } from 'zod'
import { LiveAmountDisplay } from './LiveAmountDisplay'

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const createValidationSchema = (orders: { id: string; amount: string }[]) => {
  return z
    .object({
      orders: z.record(
        z.string(),
        z.object({
          id: z.string(),
          assetId: z.any(),
          chainId: z.number(),
          amount: z.string(),
          isSelected: z.boolean(),
        })
      ),
    })
    .superRefine((data, ctx) => {
      for (const id in data.orders) {
        const formOrder = data.orders[id]
        if (formOrder.isSelected) {
          const originalOrder = orders.find((o) => o.id === id)
          if (!originalOrder) continue

          try {
            const amountBalance = convertBalance(formOrder.amount, 18)
            const maxAmountBalance = convertBalance(originalOrder.amount, 18)
            const zeroBalance = Balance.fromFloat('0', 18)

            if (amountBalance.lte(zeroBalance)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [`orders`, id, `amount`],
                message: 'Amount must be greater than 0',
              })
            }

            if (amountBalance.gt(maxAmountBalance)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [`orders`, id, `amount`],
                message: `Cannot approve more than the pending amount`,
              })
            }
          } catch (error) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`orders`, id, `amount`],
              message: 'Invalid number format',
            })
          }
        }
      }
    })
}

export const ApproveDeposits = ({ onClose }: { onClose: () => void }) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, poolCurrency, shareClassDetails } = useSelectedPool()
  const { data: holdings } = useHoldings(shareClass, { enabled: !!shareClass })
  const { data: pendingOrders } = usePendingAmounts(shareClass, {
    enabled: !!shareClass,
  })

  const orders = useMemo(() => {
    return (
      pendingOrders
        ?.map((order, index) => ({
          chainId: order.chainId,
          amount: order.pendingDeposit.toFloat().toString(),
          assetId: order.assetId,
          id: `${order.assetId.toString()}-${index}`,
        }))
        .filter((order) => order.amount !== '0') ?? []
    )
  }, [pendingOrders])

  const ordersByChain = useOrdersByChainId(orders)
  const validationSchema = createValidationSchema(orders)

  const defaultOrders = useMemo(
    () =>
      orders.reduce(
        (acc, o) => {
          acc[o.id] = {
            id: o.id,
            assetId: o.assetId,
            chainId: o.chainId,
            amount: '0',
            isSelected: false,
          }
          return acc
        },
        {} as Record<string, { id: string; assetId: AssetId; chainId: number; amount: string; isSelected: boolean }>
      ),
    [orders]
  )

  const form = useForm({
    defaultValues: { orders: defaultOrders },
    onSubmit: async (data) => {
      const validationResult = validationSchema.safeParse(data)
      if (!validationResult.success) {
        return
      }

      const { orders } = validationResult.data
      const arr = Object.values(orders).filter((o) => o.isSelected)

      if (!arr.length || !shareClass) {
        onClose()
        return
      }

      const assets = arr.map((o) => {
        const holding = holdings?.find((h) => h.assetId.toString() === o.assetId.toString())
        return {
          assetId: o.assetId,
          approveAssetAmount: convertBalance(o.amount, holding?.asset?.decimals ?? 18),
        }
      })
      await execute(shareClass.approveDepositsAndIssueShares(assets))
      onClose()
    },
  })

  const { setValue, watch, setError, clearErrors, formState } = form
  const watchedOrders = watch('orders')
  const prevWatchedOrders = usePrevious(watchedOrders)

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
      const fieldName = `orders.${id}.amount`
      const currentError = (formState.errors.orders?.[id]?.amount as any)?.message
      const newError = activeErrors.get(fieldName)

      if (newError && currentError !== newError) {
        setError(fieldName as any, { type: 'manual', message: newError })
      } else if (!newError && currentError) {
        clearErrors(fieldName as any)
      }
    })
  }, [watchedOrders, validationSchema, setError, clearErrors, formState.errors])

  useEffect(() => {
    if (!prevWatchedOrders) return
    for (const id in watchedOrders) {
      const currentOrder = watchedOrders[id]
      const prevOrder = prevWatchedOrders[id]
      if (prevOrder && !currentOrder.isSelected && prevOrder.isSelected) {
        setValue(`orders.${id}.amount`, '0', { shouldValidate: false })
      }
    }
  }, [watchedOrders, prevWatchedOrders, setValue])

  const extraColumns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: `Approve amount`,
        render: ({ id }: TableData) => {
          const isSelected = watchedOrders?.[id]?.isSelected ?? false
          return (
            <BalanceInput
              name={`orders.${id}.amount`}
              buttonLabel="MAX"
              decimals={poolCurrency?.decimals}
              disabled={!isSelected}
              onButtonClick={() => {
                const originalOrder = orders.find((o) => o.id === id)
                if (originalOrder) {
                  setValue(`orders.${id}.amount`, originalOrder.amount, { shouldValidate: true })
                }
              }}
            />
          )
        },
      },
      {
        header: 'Estimated payout',
        render: ({ id }: TableData) => {
          return <LiveAmountDisplay name={`orders.${id}.amount`} calculationType="revoke" />
        },
      },
    ]
  }, [orders, setValue, watchedOrders, poolCurrency?.decimals, shareClassDetails?.pricePerShare])

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
          disabled={!formState.isValid && formState.isSubmitted}
        />
      </Grid>
    </Form>
  )
}
