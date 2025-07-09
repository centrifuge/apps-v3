import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box } from '@chakra-ui/react'
import { createBalanceSchema, Form, safeParse, useForm } from '@centrifuge/forms'
import { Balance, type Vault } from '@centrifuge/sdk'
import { useInvestment, useCentrifugeTransaction, useVaultDetails } from '@centrifuge/shared'
import {
  RedeemAction,
  RedeemFormDefaultValues,
  type RedeemActionType,
} from '@components/InvestRedeemSection/components/defaults'
import { RedeemTabForm } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTabForm'

export default function RedeemTab({ vault, vaults }: { vault: Vault; vaults: Vault[] }) {
  const { data: vaultDetails } = useVaultDetails(vault)
  const { data: investment } = useInvestment(vault)
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<RedeemActionType>(RedeemAction.REDEEM_AMOUNT)

  function redeem(amount: Balance) {
    execute(vault.increaseRedeemOrder(amount))
  }

  const schema = z.object({
    redeemAmount: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18, z.number().min(0.01)),
    receiveAmount: createBalanceSchema(vaultDetails?.investmentCurrency.decimals ?? 6, z.number().min(0.01)),
  })

  const form = useForm({
    schema,
    defaultValues: RedeemFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      redeem(values.redeemAmount)
      setActionType(RedeemAction.CANCEL)
    },
    onSubmitError: (error) => console.error('Redeem form submission error:', error),
  })

  const { watch } = form
  const redeemAmount = watch('redeemAmount')

  const parsedRedeemAmount = useMemo(
    () => safeParse(schema.shape.redeemAmount, redeemAmount) ?? 0,
    [redeemAmount, schema.shape.redeemAmount]
  )
  const isDisabled = isPending || !vaultDetails || !investment || parsedRedeemAmount === 0

  return (
    <Form form={form} style={{ height: '100%' }}>
      <Box mt={4} height="100%">
        <RedeemTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          parsedRedeemAmount={parsedRedeemAmount}
          vault={vault}
          vaults={vaults}
          setActionType={setActionType}
        />
      </Box>
    </Form>
  )
}
