import { useMemo, useEffect, useRef } from 'react'
import { useCentrifugeTransaction, usePendingAmounts } from '@centrifuge/shared'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useForm } from '@centrifuge/forms'
import { Price } from '@centrifuge/sdk'
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

type Mode = 'issue' | 'revoke'

export const useShareProcessing = (mode: Mode, onClose: () => void) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { shareClass, shareClassDetails } = useSelectedPool()
  const { data: pendingOrders } = usePendingAmounts(shareClass, { enabled: !!shareClass })

  const validationSchema = createValidationSchema()

  const orders = useMemo(() => {
    if (!pendingOrders) return []
    const priceStr = shareClassDetails?.pricePerShare?.toDecimal().toString() ?? '0'

    return (
      pendingOrders
        .flatMap((order) => {
          const source = mode === 'issue' ? order.pendingIssuances : order.pendingRevocations
          return source.map((item, itemIndex) => ({
            chainId: order.chainId,
            amount: item.amount.toFloat().toString(),
            assetId: order.assetId,
            approvedAt: item.approvedAt,
            id: `${order.assetId.toString()}-${item.epoch}-${itemIndex}`,
            isSelected: false,
            epoch: item.epoch,
            pricePerShare: priceStr,
          }))
        })
        .filter((o) => o.amount !== '0')
        .sort((a, b) => a.assetId.toString().localeCompare(b.assetId.toString()) || a.epoch - b.epoch) ?? []
    )
  }, [pendingOrders, shareClassDetails, mode])

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

      const assets = arr.map((o: any) => {
        const price = Price.fromFloat(o.pricePerShare)
        return mode === 'issue'
          ? { assetId: o.assetId, issuePricePerShare: price }
          : { assetId: o.assetId, revokePricePerShare: price }
      })

      if (mode === 'issue') {
        await execute(shareClass.approveDepositsAndIssueShares(assets as any))
      } else {
        await execute(shareClass.approveRedeemsAndRevokeShares(assets as any))
      }

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
      if (!prevWatchedOrders[order.id]?.isSelected && watchedOrders[order.id]?.isSelected) continue
      if (prevWatchedOrders[order.id]?.isSelected && !watchedOrders[order.id]?.isSelected) {
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
    if (changed) setValue('orders', newOrders)
  }, [watchedOrders, prevWatchedOrders, orders, setValue])

  useEffect(() => {
    const result = validationSchema.safeParse({ orders: watchedOrders })
    const activeErrors = new Map<string, string>()
    if (!result.success) {
      result.error.issues.forEach((issue) => activeErrors.set(issue.path.join('.'), issue.message))
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
      if (prevOrder && !watchedOrders[prevOrder.id]?.isSelected) {
        disabledMap[order.id] = true
      }
    }
    return disabledMap
  }, [orders, watchedOrders])

  return {
    form,
    orders,
    disabledStates,
    isPending,
  }
}
