import { useEffect, useRef } from 'react'
import { TransactionToaster, toaster } from './TransactionToaster'
import { useTransactions } from '../../hooks/TransactionProvider'

const env = import.meta.env.VITE_CENTRIFUGE_ENV
const etherScanUrl = env === 'testnet' ? 'https://sepolia.etherscan.io/' : 'https://etherscan.io/'

export function TransactionToasts() {
  const { transactions } = useTransactions()

  const activeToastIds = useRef<Record<string, string>>({})

  const txHashLink = (message: string, txHash?: string) => (
    <>
      <p>{message}</p>
      {txHash ? (
        <a href={`${etherScanUrl}tx/${txHash}`} target="_blank" rel="noopener noreferrer">{`Hash: ${txHash}`}</a>
      ) : null}
    </>
  )

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
              description:
                tx.status === 'creating'
                  ? 'Creating transaction'
                  : tx.status === 'unconfirmed'
                    ? 'Signing transaction'
                    : 'Transaction pending',
              type: 'loading',
              duration: undefined,
              closable: true,
              id: tx.id,
            })

            activeToastIds.current[tx.id] = toastId
          }
          break
        }
        case 'succeeded': {
          if (activeToastIds.current[tx.id]) {
            const toastIdToDismiss = activeToastIds.current[tx.id]
            const txHash = (tx.result?.transactionHash as string) || tx.hash
            const message = 'Transaction Successful'

            toaster.update(toastIdToDismiss, {
              title: tx.title,
              description: txHashLink(message, txHash),
              type: 'success',
              duration: 10_000,
              closable: true,
            })

            delete activeToastIds.current[tx.id]
          }
          break
        }
        case 'failed': {
          if (activeToastIds.current[tx.id]) {
            const toastIdToDismiss = activeToastIds.current[tx.id]
            const reason = tx.failedReason || tx.error?.shortMessage || ''
            const message = `Transaction failed${reason ? `: ${reason}` : ''}`
            const txHash = (tx.result?.transactionHash as string) || tx.hash

            toaster.update(toastIdToDismiss, {
              title: tx.title,
              description: txHashLink(message, txHash),
              type: 'error',
              duration: 60_000,
              closable: true,
            })

            delete activeToastIds.current[tx.id]
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
