import { type OperationConfirmedStatus, type Transaction } from '@centrifuge/sdk'
import { useMutation } from '@tanstack/react-query'
import { lastValueFrom, tap } from 'rxjs'
import { useConnectorClient } from 'wagmi'
import { useCentrifuge } from './CentrifugeContext'
import { useTransactions } from './TransactionProvider'

export function useCentrifugeTransaction() {
  const centrifuge = useCentrifuge()
  const { updateTransaction, addOrUpdateTransaction } = useTransactions()
  const { data: client } = useConnectorClient()
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: execute,
  })

  async function execute(observable: Transaction) {
    if (!client) {
      throw new Error('No wallet connected')
    }
    centrifuge.setSigner(client)
    let lastId = ''
    try {
      const lastResult = await lastValueFrom(
        observable.pipe(
          tap((result) => {
            switch (result.type) {
              case 'SigningTransaction':
                lastId = result.id
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'unconfirmed',
                })
                break
              case 'TransactionPending':
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'pending',
                })
                break
              case 'TransactionConfirmed':
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'succeeded',
                  result: result.receipt,
                })
            }
          })
        )
      )
      return lastResult as OperationConfirmedStatus
    } catch (e) {
      if (lastId) {
        updateTransaction(lastId, {
          status: 'failed',
          error: e,
        })
      }
      throw e
    }
  }

  return {
    execute: mutateAsync,
    ...rest,
  }
}
