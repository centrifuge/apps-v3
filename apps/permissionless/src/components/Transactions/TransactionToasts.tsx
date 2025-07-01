import { useEffect, useRef } from 'react'
import { Toaster, toaster } from '@centrifuge/ui'
import { useTransactions } from '@components/Transactions/TransactionProvider'

export function TransactionToasts() {
  const { transactions, updateTransaction } = useTransactions()

  const shownToastIds = useRef<Record<string, boolean>>({})

  useEffect(() => {
    transactions
      .filter((tx) => !tx.dismissed && !['creating', 'unconfirmed'].includes(tx.status))
      .forEach((tx) => {
        if (shownToastIds.current[tx.id]) return
        shownToastIds.current[tx.id] = true

        let type: 'loading' | 'success' | 'error' | 'info' | 'warning' = 'info'
        if (tx.status === 'pending') type = 'loading'
        else if (tx.status === 'succeeded') type = 'success'
        else if (tx.status === 'failed') type = 'error'

        const description =
          tx.status === 'failed' && tx.failedReason
            ? tx.failedReason
            : {
                creating: 'Creating transaction',
                unconfirmed: 'Signing transaction',
                pending: 'Transaction pending',
                succeeded: 'Transaction successful',
                failed: 'Transaction failed',
              }[tx.status] || ''

        const duration = type === 'loading' ? undefined : type === 'error' ? 60_000 : 10_000

        // Create toast
        toaster.create({
          title: tx.title,
          description,
          type,
          duration,
          closable: true,
        })
      })
  }, [transactions, updateTransaction])

  return <Toaster />
}
