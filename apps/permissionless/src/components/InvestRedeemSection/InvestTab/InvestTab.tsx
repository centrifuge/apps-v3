import { Balance, Vault } from '@centrifuge/sdk'
import { Box } from '@chakra-ui/react'
import { useCentrifugeTransaction } from '../../../hooks/useCentrifugeTransaction'
import { useInvestment, useVaultDetails } from '@centrifuge/shared'
import { z } from 'zod'
import { Form, useForm, safeParse, numberInputMin, createBalanceSchema } from '@centrifuge/forms'
import { useMemo, useState } from 'react'
import { type InvestActionType, InvestAction, InvestFormDefaultValues } from '../components/defaults'
import { InvestTabForm } from './forms/InvestTabForm'

export default function InvestTab({ vault }: { vault: Vault }) {
  const { data: vaultDetails } = useVaultDetails(vault)
  const { data: investment } = useInvestment(vault)
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  // TODO: remove this console log before deploying
  console.log('investment', investment, vaultDetails)

  function invest(amount: Balance) {
    execute(vault.increaseInvestOrder(amount))
  }

  // TODO: Add any necessary refinements for validation checks
  const schema = z.object({
    amount: createBalanceSchema(vaultDetails?.investmentCurrency.decimals ?? 6, z.number().min(0.01)),
    amountToReceive: numberInputMin(0),
    requirement_nonUsCitizen: z.boolean().refine((val) => val === true, {
      message: 'Non-US citizen requirement must be confirmed',
    }),
    requirement_nonSanctionedList: z.boolean().refine((val) => val === true, {
      message: 'Non-sanctioned list requirement must be confirmed',
    }),
    requirement_redeemLater: z.boolean().refine((val) => val === true, {
      message: 'Redeem later requirement must be confirmed',
    }),
    investorRequirements: z.array(z.boolean()).length(3, 'Array must contain exactly 3 requirements'),
  })

  const form = useForm({
    schema,
    defaultValues: InvestFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Invest form values: ', values)
      // Since amount is now of type Balance, we can directly pass it to the invest function
      // invest(values.amount)
      setActionType(InvestAction.SUCCESS)
    },
    onSubmitError: (error) => console.error('Invest form submission error:', error),
  })

  const { watch } = form
  const [amount] = watch(['amount'])

  const parsedAmount = useMemo(() => safeParse(schema.shape.amount, amount) ?? 0, [amount, schema.shape.amount])

  // const isDisabled =
  //   form.values.amount === 0 ||
  //   form.values.investorRequirements.length !== 3;

  return (
    <Form form={form}>
      <Box mt={4}>
        <InvestTabForm actionType={actionType} parsedAmount={parsedAmount} setActionType={setActionType} />
      </Box>
    </Form>
  )
}
