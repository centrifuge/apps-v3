import { Balance, type Vault } from '@centrifuge/sdk'
import { Box } from '@chakra-ui/react'
import { z } from 'zod'
import { useCentrifugeTransaction } from '../../../hooks/useCentrifugeTransaction'
import { useInvestment, useVaultDetails } from '../../../hooks/useVaults'
import { createBalanceSchema, Form, numberInputMin, safeParse, useForm } from '../../../forms'
import { useMemo, useState } from 'react'
import { RedeemAction, RedeemFormDefaultValues, type RedeemActionType } from '../components/defaults'
import { RedeemTabForm } from './forms/RedeemTabForm'

export default function RedeemTab({ vault }: { vault: Vault }) {
  const { data: vaultDetails } = useVaultDetails(vault)
  const { data: investment } = useInvestment(vault)
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<RedeemActionType>(RedeemAction.REDEEM_AMOUNT)

  // TODO: remove this console log before deploying
  console.log('investment', investment)

  function redeem(amount: Balance) {
    execute(vault.increaseRedeemOrder(amount))
  }

  // TODO: Add necessary refinements for validation checks
  const schema = z.object({
    amount: createBalanceSchema(vaultDetails?.investmentCurrency.decimals ?? 6, z.number().min(0.01)),
    amountToReceive: numberInputMin(0),
  })

  const form = useForm({
    schema,
    defaultValues: RedeemFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Redeem values: ', values)
      // Since amount is now of type Balance, we can directly pass it to the redeem function
      // redeem(values.amount)
      setActionType(RedeemAction.CANCEL)
    },
    onSubmitError: (error) => console.error('Redeem form submission error:', error),
  })

  const { watch } = form
  const amount = watch('amount')

  const parsedAmount = useMemo(() => safeParse(schema.shape.amount, amount) ?? 0, [amount, schema.shape.amount])

  return (
    <Form form={form}>
      <Box mt={4}>
        <RedeemTabForm actionType={actionType} parsedAmount={parsedAmount} setActionType={setActionType} />
      </Box>
    </Form>
  )
}
