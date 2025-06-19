import { useEffect, useRef } from 'react'
import { useTransactions } from './TransactionProvider'

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

        const duration = type === 'loading' ? null : type === 'error' ? 60_000 : 10_000

        // TODO: create toaste
      })
  }, [transactions, updateTransaction])

  return null
}
