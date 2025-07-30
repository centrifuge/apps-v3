import { BalanceInput, createBalanceSchema, Form, safeParse, useForm } from '@centrifuge/forms'
import {
  Holdings,
  networkToName,
  truncateAddress,
  useAddress,
  useBalanceSheet,
  useCentrifugeTransaction,
} from '@centrifuge/shared'
import { DisplayInput, Modal } from '@centrifuge/ui'
import { Grid, Stack } from '@chakra-ui/react'
import { SummaryBox } from './SummaryBox'
import { useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

import z from 'zod'

export const HoldingsForm = ({
  isWithdraw = false,
  selectedHolding,
  availableBalance,
  openModal,
  setOpenModal,
}: {
  isWithdraw?: boolean
  selectedHolding: Holdings[number]
  availableBalance: Balance
  openModal: { deposit: boolean; withdraw: boolean }
  setOpenModal: (openModal: { deposit: boolean; withdraw: boolean }) => void
}) => {
  const { execute, isPending } = useCentrifugeTransaction()
  const { address } = useAddress()
  const { shareClass } = useSelectedPool()
  const { data: balanceSheet } = useBalanceSheet(shareClass, selectedHolding.asset.chainId, { enabled: !!shareClass })
  const truncate = truncateAddress(address)

  const modalTitle = useMemo(() => {
    return `${isWithdraw ? 'Withdraw' : 'Deposit'} ${selectedHolding.asset.symbol} on ${networkToName(selectedHolding.asset.chainId)}`
  }, [isWithdraw, selectedHolding])

  const form = useForm({
    schema: z.object({
      amount: createBalanceSchema(selectedHolding?.asset.decimals ?? 18),
    }),
    defaultValues: {
      amount: '0',
    },
    onSubmit: async (values) => {
      const { amount } = values
      if (!balanceSheet) return
      if (isWithdraw) {
        await execute(balanceSheet?.withdraw(selectedHolding.assetId, address, amount))
        setOpenModal({ ...openModal, withdraw: false })
      } else {
        console.log('Depositing', amount, selectedHolding)
        await execute(balanceSheet?.deposit(selectedHolding.assetId, amount))
        setOpenModal({ ...openModal, deposit: false })
      }
    },
  })

  const { watch } = form
  const amount = watch('amount')

  const parsedAmount = useMemo(() => {
    return safeParse(createBalanceSchema(selectedHolding?.asset.decimals ?? 18), amount)
  }, [amount, selectedHolding])

  const summaryItems = useMemo(() => {
    return [
      {
        label: 'Available balance',
        balance: availableBalance,
        currency: selectedHolding?.asset.symbol,
      },
      {
        label: isWithdraw ? 'Withdraw amount' : 'Deposit amount',
        balance: parsedAmount ?? new Balance(0, selectedHolding?.asset.decimals ?? 18),
        currency: selectedHolding?.asset.symbol,
      },
    ]
  }, [availableBalance, isWithdraw, parsedAmount])

  return (
    <Form form={form}>
      <Modal
        isOpen={isWithdraw ? openModal.withdraw : openModal.deposit}
        onClose={() => setOpenModal({ ...openModal, deposit: false, withdraw: false })}
        title={modalTitle}
        onPrimaryAction={() => form.handleSubmit()}
        primaryActionText={isWithdraw ? 'Withdraw' : 'Deposit'}
        isPrimaryActionLoading={isPending}
        isPrimaryActionDisabled={!!form.formState.errors.amount || parsedAmount?.isZero()}
        size="xl"
      >
        <Grid gridTemplateColumns="1fr 1fr" gap={4}>
          <Stack gap={2}>
            <DisplayInput
              label={isWithdraw ? 'Destination address' : 'Source address'}
              value={isWithdraw ? truncate : `Connected wallet (${truncate})`}
              size="sm"
            />
            <BalanceInput
              name="amount"
              label="Amount"
              size="sm"
              currency={selectedHolding?.asset.symbol}
              decimals={selectedHolding?.asset.decimals}
            />
          </Stack>
          <SummaryBox
            title="Transaction summary"
            summaryItems={summaryItems}
            infoText={
              isWithdraw
                ? 'Stablecoins will be transferred to the specified withdrawal addresses on the asset network. '
                : 'Stablecoins will be transferred to the escrow account of the pool on the assets networks. Wallet must be connected to the network of the asset.'
            }
          />
        </Grid>
      </Modal>
    </Form>
  )
}
