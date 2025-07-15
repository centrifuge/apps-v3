import { useMemo, useState } from 'react'
import { useChainId } from 'wagmi'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema } from '@centrifuge/forms'
import { Balance } from '@centrifuge/sdk'
import {
  formatBalanceToString,
  useCentrifugeTransaction,
  useInvestment,
  useIsMember,
  usePortfolio,
  useVaultDetails,
} from '@centrifuge/shared'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'
import { infoText } from '@utils/infoText'
import { TabProps } from '@components/InvestRedeemSection'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'

export default function InvestTab({ networks, shareClassId, vault, vaults, setVault }: TabProps) {
  const connectedChainId = useChainId()
  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault)
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault)
  const { data: portfolio, isLoading: isPortfolioLoading } = usePortfolio()
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, connectedChainId)
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioBalance = portfolioInvestmentAsset?.balance
  const isInvestorWhiteListed = !!isMember

  const maxInvestAmount = useMemo(() => {
    if (!portfolioBalance) return '0'
    return formatBalanceToString(portfolioBalance, portfolioBalance.decimals) ?? '0'
  }, [portfolioBalance])

  function invest(amount: Balance) {
    execute(vault.increaseInvestOrder(amount))
  }

  // TODO: Add any necessary refinements for validation checks
  const schema = z.object({
    investAmount: createBalanceSchema(
      vaultDetails?.investmentCurrency.decimals ?? 6,
      z.number().min(1).max(Number(maxInvestAmount))
    ),
    receiveAmount: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18).optional(),
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
      invest(values.investAmount)
      setActionType(InvestAction.SUCCESS)
    },
    onSubmitError: (error) => console.error('Invest form submission error:', error),
  })

  const { watch } = form
  const [investAmount] = watch(['investAmount'])

  const parsedInvestAmount = useMemo(
    () => safeParse(schema.shape.investAmount, investAmount) ?? 0,
    [investAmount, schema.shape.investAmount]
  )

  const isLoading = isVaultDetailsLoading || isInvestmentLoading || isPortfolioLoading || isMemberLoading
  const isDisabled = !vaultDetails || !investment || parsedInvestAmount === 0 || isPending

  if (isLoading) {
    return (
      <Box minH="298px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="black.solid" />
      </Box>
    )
  }

  if (!isInvestorWhiteListed) {
    return <InfoWrapper text={infoText().investorNotWhitelisted} type="info" />
  }

  return (
    <Form form={form} style={{ height: '100%' }}>
      <Box mt={4} height="100%">
        <InvestTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          maxInvestAmount={maxInvestAmount}
          networks={networks}
          parsedInvestAmount={parsedInvestAmount}
          vaults={vaults}
          vaultDetails={vaultDetails}
          setActionType={setActionType}
          setVault={setVault}
        />
      </Box>
    </Form>
  )
}
