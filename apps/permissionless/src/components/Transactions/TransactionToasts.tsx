import { useEffect, useRef } from 'react'
import { Toaster, toaster } from '@centrifuge/ui'
import { useTransactions } from '@components/Transactions/TransactionProvider'

export function TransactionToasts() {
  const { transactions, updateTransaction } = useTransactions()

  const activeToastIds = useRef<Record<string, string>>({})

  useEffect(() => {
    transactions.forEach((tx) => {
      // 1. Handle creating/updating toasts for in-progress transactions (creating, unconfirmed, pending)
      if (['creating', 'unconfirmed', 'pending'].includes(tx.status) && !tx.dismissed) {
        // If a toast for this transaction doesn't exist yet, create a new 'loading' toast
        if (!activeToastIds.current[tx.id]) {
          const description =
            tx.status === 'creating'
              ? 'Creating transaction'
              : tx.status === 'unconfirmed'
                ? 'Signing transaction'
                : tx.status === 'pending'
                  ? 'Transaction pending'
                  : ''

          // Create a loading toast and store its ID
          const toastId = toaster.create({
            title: tx.title,
            description,
            type: 'loading',
            duration: undefined,
            closable: true,
            id: tx.id,
          })

          activeToastIds.current[tx.id] = toastId
        }
      }
      // 2. Handle transactions that have reached a final state (succeeded or failed)
      else if (['succeeded', 'failed'].includes(tx.status) && activeToastIds.current[tx.id]) {
        const toastIdToDismiss = activeToastIds.current[tx.id]
        const type: 'success' | 'error' = tx.status === 'succeeded' ? 'success' : 'error'
        const description =
          tx.status === 'failed' && tx.failedReason
            ? tx.failedReason
            : tx.status === 'succeeded'
              ? 'Transaction successful'
              : tx.status === 'failed'
                ? 'Transaction failed'
                : ''

        toaster.update(toastIdToDismiss, {
          title: tx.title,
          description,
          type,
          duration: type === 'error' ? 60_000 : 5_000,
          closable: true,
        })

        // Dismiss the toast immediately after updating it to its final state
        toaster.dismiss(toastIdToDismiss)
        delete activeToastIds.current[tx.id] // Remove from our tracking ref
      }
      // 3. Handle transactions that are explicitly marked as dismissed
      else if (tx.dismissed && activeToastIds.current[tx.id]) {
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
  }, [transactions, updateTransaction])

  return <Toaster />
}
