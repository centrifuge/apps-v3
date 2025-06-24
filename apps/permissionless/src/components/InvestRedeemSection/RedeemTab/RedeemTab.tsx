import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box } from '@chakra-ui/react'
import { createBalanceSchema, Form, safeParse, useForm } from '@centrifuge/forms'
import { Balance, type Vault } from '@centrifuge/sdk'
import { useInvestment, useVaultDetails } from '@centrifuge/shared'
import { useCentrifugeTransaction } from '@hooks/useCentrifugeTransaction'
import {
  RedeemAction,
  RedeemFormDefaultValues,
  type RedeemActionType,
} from '@components/InvestRedeemSection/components/defaults'
import { RedeemTabForm } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTabForm'

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
    amount: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18, z.number().min(0.01)),
    amountToReceive: createBalanceSchema(vaultDetails?.investmentCurrency.decimals ?? 6, z.number().min(0.01)),
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
  const isDisabled = isPending || !vaultDetails || !investment || parsedAmount === 0

  return (
    <Form form={form}>
      <Box mt={4}>
        <RedeemTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          parsedAmount={parsedAmount}
          vaultDetails={vaultDetails}
          setActionType={setActionType}
        />
      </Box>
    </Form>
  )
}
