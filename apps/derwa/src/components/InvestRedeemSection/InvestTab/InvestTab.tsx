import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema } from '@centrifuge/forms'
import { Balance } from '@centrifuge/sdk'
import {
  formatBalanceToString,
  useCentrifugeTransaction,
  useInvestment,
  usePortfolio,
  useVaultDetails,
} from '@centrifuge/shared'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'
import { TabProps } from '@components/InvestRedeemSection'

export default function InvestTab({ isLoading: isTabLoading, vault }: TabProps) {
  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault)
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault)
  const { data: portfolio, isLoading: isPortfolioLoading } = usePortfolio()
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioBalance = portfolioInvestmentAsset?.balance

  const maxInvestAmount = useMemo(() => {
    if (!portfolioBalance) return '0'
    return formatBalanceToString(portfolioBalance, portfolioBalance.decimals) ?? '0'
  }, [portfolioBalance])

  function invest(amount: Balance) {
    execute(vault.increaseInvestOrder(amount))
  }

  const schema = z.object({
    investAmount: createBalanceSchema(
      vaultDetails?.investmentCurrency.decimals ?? 18,
      z.number().min(1).max(Number(maxInvestAmount))
    ),
    receiveAmount: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18).optional(),
    // TODO: Use these when we need to add the sync invest action
    // requirement_nonUsCitizen: z.boolean().refine((val) => val === true, {
    //   message: 'Non-US citizen requirement must be confirmed',
    // }),
    // requirement_nonSanctionedList: z.boolean().refine((val) => val === true, {
    //   message: 'Non-sanctioned list requirement must be confirmed',
    // }),
    // requirement_redeemLater: z.boolean().refine((val) => val === true, {
    //   message: 'Redeem later requirement must be confirmed',
    // }),
    // investorRequirements: z.array(z.boolean()).length(3, 'Array must contain exactly 3 requirements'),
  })

  const form = useForm({
    schema,
    defaultValues: InvestFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      invest(values.investAmount)
      setActionType(InvestAction.CONFIRM)
    },
    onSubmitError: (error) => console.error('Invest form submission error:', error),
  })

  const { watch } = form
  const [investAmount] = watch(['investAmount'])

  const parsedInvestAmount = useMemo(
    () => safeParse(schema.shape.investAmount, investAmount) ?? 0,
    [investAmount, schema.shape.investAmount]
  )

  const isLoading = isTabLoading || isVaultDetailsLoading || isInvestmentLoading || isPortfolioLoading
  const isDisabled = isPending || !investment || !vaultDetails

  if (isLoading) {
    return (
      <Box height="100%" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="black.solid" />
      </Box>
    )
  }

  return (
    <Form form={form} style={{ height: '100%' }}>
      <Box mt={4} height="100%">
        <InvestTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          maxInvestAmount={maxInvestAmount}
          parsedInvestAmount={parsedInvestAmount}
          setActionType={setActionType}
        />
      </Box>
    </Form>
  )
}
