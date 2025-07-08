import { useEffect, useRef } from 'react'
import { TransactionToaster, toaster } from './TransactionToaster'
import { useTransactions } from '../hooks/TransactionProvider'
import { getCompletedTxDescription, getNewOrUpdatedTxDescription } from '../utils/toastsUtils'

export function TransactionToasts() {
  const { transactions } = useTransactions()

  const activeToastIds = useRef<Record<string, string>>({})

  useEffect(() => {
    transactions.forEach((tx) => {
      switch (tx.status) {
        case 'creating':
        case 'unconfirmed':
        case 'pending': {
          if (!activeToastIds.current[tx.id] && !tx.dismissed) {
            // Create a loading toast and store its ID
            const toastId = toaster.create({
              title: tx.title,
              description: getNewOrUpdatedTxDescription(tx.status),
              type: 'loading',
              duration: undefined,
              closable: true,
              id: tx.id,
            })

            activeToastIds.current[tx.id] = toastId
          }
          break
        }
        case 'succeeded':
        case 'failed': {
          if (activeToastIds.current[tx.id]) {
            const toastIdToDismiss = activeToastIds.current[tx.id]
            const type: 'success' | 'error' = tx.status === 'succeeded' ? 'success' : 'error'

            toaster.update(toastIdToDismiss, {
              title: tx.title,
              description: getCompletedTxDescription(tx),
              type,
              duration: type === 'error' ? 60_000 : 5_000,
              closable: true,
            })

            delete activeToastIds.current[tx.id] // Remove from our tracking ref
          }
          break
        }
      }

      // Handle transactions that are explicitly marked as dismissed
      if (tx.dismissed && activeToastIds.current[tx.id]) {
        const toastIdToDismiss = activeToastIds.current[tx.id]
        toaster.dismiss(toastIdToDismiss)
        delete activeToastIds.current[tx.id]
      }
    })

    // Cleanup: Dismiss any toasts that are no longer present in the `transactions` list
    const currentTxIds = new Set(transactions.map((t) => t.id))
    for (const txId in activeToastIds.current) {
      if (!currentTxIds.has(txId)) {
        toaster.dismiss(activeToastIds.current[txId])
        delete activeToastIds.current[txId]
      }
    }
  }, [transactions])

  return <TransactionToaster />
}
