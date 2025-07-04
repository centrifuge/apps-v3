import { Stack, Toast, ToastStatus } from '@centrifuge/fabric'
import { useTransactions } from './TransactionsProvider'

const toastStatus: { [key: string]: ToastStatus } = {
  creating: 'pending',
  unconfirmed: 'pending',
  pending: 'pending',
  succeeded: 'ok',
  failed: 'critical',
}

const toastSublabel = {
  creating: 'Creating transaction',
  unconfirmed: 'Signing transaction',
  pending: 'Transaction pending',
  succeeded: 'Transaction successful',
  failed: 'Transaction failed',
}

const TOAST_DURATION = 10000
const ERROR_TOAST_DURATION = 60000

export type TransactionToastsProps = {
  positionProps?: {
    top?: number | string
    right?: number | string
    bottom?: number | string
    left?: number | string
    width?: number | string
    zIndex?: number | string
  }
}

export function TransactionToasts({
  positionProps = {
    top: 64,
    right: 1,
  },
}: TransactionToastsProps) {
  const { transactions, updateTransaction } = useTransactions()

  const dismiss = (txId: string) => () => updateTransaction(txId, { dismissed: true })

  return (
    <Stack gap={2} position="fixed" width={330} zIndex="onTopOfTheWorld" {...positionProps}>
      {transactions
        .filter((tx) => !tx.dismissed && !['creating', 'unconfirmed'].includes(tx.status))
        .map((tx) => {
          return (
            <Toast
              label={tx.title}
              sublabel={(tx.status === 'failed' && tx.failedReason) || toastSublabel[tx.status]}
              status={toastStatus[tx.status]}
              onDismiss={dismiss(tx.id)}
              onStatusChange={(newStatus) => {
                if (['ok', 'critical'].includes(newStatus)) {
                  setTimeout(dismiss(tx.id), newStatus === 'ok' ? TOAST_DURATION : ERROR_TOAST_DURATION)
                }
              }}
              key={tx.id}
            />
          )
        })}
    </Stack>
  )
}
