import type { Transaction } from '@components/Transactions/TransactionProvider'

export function getCompletedTxDescription(tx: Transaction) {
  const { status } = tx
  if (status === 'succeeded') {
    if (tx.result?.transactionHash || tx.hash) {
      return `Transaction successful 
        hash:${tx.result?.transactionHash || tx.hash}`
    }

    return 'Transaction successful'
  }

  if (status === 'failed') {
    const reason = tx.failedReason || tx.error?.shortMessage || ''
    const message = `Transaction failed${reason ? `: ${reason}` : ''}`
    if (tx.result?.transactionHash || tx.hash) {
      return `${message} 
        hash:${tx.result?.transactionHash || tx.hash}${reason ? `: ${reason}` : ''}`
    }
    return message
  }

  return 'Transaction status unknown'
}

export function getNewOrUpdatedTxDescription(txStatus: Transaction['status']) {
  switch (txStatus) {
    case 'creating':
      return 'Creating transaction'
    case 'unconfirmed':
      return 'Signing transaction'
    default:
      return 'Transaction pending'
  }
}
