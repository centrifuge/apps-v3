import { Dispatch, useMemo, useState } from 'react'
import { z } from 'zod'
import { Box } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema } from '@centrifuge/forms'
import { Balance, Vault } from '@centrifuge/sdk'
import { useInvestment, useVaultDetails } from '@centrifuge/shared'
import { useCentrifugeTransaction } from '@hooks/useCentrifugeTransaction'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'

export default function InvestTab({
  vault,
  setVault,
  vaults,
}: {
  vault: Vault
  setVault: Dispatch<Vault>
  vaults: Vault[]
}) {
  const { data: vaultDetails } = useVaultDetails(vault)
  const { data: investment } = useInvestment(vault)
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  function invest(amount: Balance) {
    execute(vault.increaseInvestOrder(amount))
  }

  // TODO: Add any necessary refinements for validation checks
  const schema = z.object({
    amount: createBalanceSchema(vaultDetails?.investmentCurrency.decimals ?? 6, z.number().min(0.01)),
    amountToReceive: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18, z.number().min(0.01)),
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
      invest(values.amount)
      setActionType(InvestAction.SUCCESS)
    },
    onSubmitError: (error) => console.error('Invest form submission error:', error),
  })

  const { watch } = form
  const [amount] = watch(['amount'])

  const parsedAmount = useMemo(() => safeParse(schema.shape.amount, amount) ?? 0, [amount, schema.shape.amount])

  const isDisabled = !vaultDetails || !investment || parsedAmount === 0 || isPending

  return (
    <Form form={form} style={{ height: '100%' }}>
      <Box mt={4} height="100%">
        <InvestTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          parsedAmount={parsedAmount}
          vaultDetails={vaultDetails}
          setActionType={setActionType}
          setVault={setVault}
          vaults={vaults}
        />
      </Box>
    </Form>
  )
}
