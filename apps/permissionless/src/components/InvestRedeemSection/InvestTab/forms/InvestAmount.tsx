import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react'
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { Balance } from '@centrifuge/sdk'
import { formatBalanceAbbreviated, usePortfolio, usePoolDetails } from '@centrifuge/shared'
import { NetworkIcons, type Network } from '@centrifuge/ui'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { infoText } from '@utils/infoText'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { VaultDetails } from '@utils/types'
import { formatBalance, formatBalanceToString } from '@centrifuge/shared'

const networks: Network[] = ['ethereum', 'arbitrum', 'celo', 'base']

interface InvestAmountProps {
  isDisabled: boolean
  parsedAmount: 0 | Balance
  vaultDetails?: VaultDetails
  currencies: { investCurrency: string; receiveCurrency: string }
  setCurrencies: Dispatch<SetStateAction<{ investCurrency: string; receiveCurrency: string }>>
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestAmount({
  isDisabled,
  parsedAmount,
  vaultDetails,
  currencies,
  setCurrencies,
  setActionType,
}: InvestAmountProps) {
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId)
  const { setValue } = useFormContext()

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const minAmount = pool?.metadata?.shareClasses
    ? (Object.values(pool?.metadata?.shareClasses || {})[0].minInitialInvestment ?? 0)
    : 0

  // Get user investment asset info
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioCurrency = portfolioInvestmentAsset?.currency
  const portfolioBalance = portfolioInvestmentAsset?.balance
  const defaultBalance = portfolioBalance ?? ({ value: 0n, decimals: 6 } as unknown as Balance)

  // Get the share class info for calculating shares amount to receive
  const shareClass = pool?.shareClasses.find((asset) => asset.shareClass.pool.chainId === investmentCurrencyChainId)
  const navPerShare = shareClass?.details.navPerShare
  const shareDecimals = shareClass?.details.navPerShare.decimals

  // Check if the user has the necessary investment currency to invest
  const hasInvestmentCurrency = portfolioCurrency?.chainId === vaultDetails?.investmentCurrency?.chainId
  const hasNoInvestmentCurrency = !hasInvestmentCurrency || portfolioBalance?.isZero
  const infoLabel = hasNoInvestmentCurrency ? infoText().portfolioMissingInvestmentCurrency : infoText().redeem

  // Calculate and update amount to receive based on user input on amount to invest
  useMemo(() => {
    if (parsedAmount === 0 || !shareClass || navPerShare === undefined) {
      return setValue('amountToReceive', '0')
    }

    const redeemAmount = formatBalanceToString(parsedAmount.mul(navPerShare), shareDecimals)
    setValue('amountToReceive', redeemAmount)
  }, [parsedAmount, shareClass, navPerShare])

  useEffect(
    () =>
      setCurrencies({
        investCurrency: portfolioCurrency?.symbol ?? 'USDC',
        receiveCurrency: shareClass?.details.symbol ?? 'deJTRYS',
      }),
    [portfolioCurrency, shareClass]
  )

  return (
    <Box>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight={500}>You pay</Text>
        <Text opacity={0.5} alignSelf="flex-end">
          (min: {formatBalanceAbbreviated(minAmount, 2, pool?.currency.symbol)})
        </Text>
      </Flex>
      <BalanceInput
        name="amount"
        decimals={portfolioCurrency?.decimals}
        placeholder="0.00"
        // disabled={!hasInvestmentCurrency}
        inputGroupProps={{
          endAddon: currencies.investCurrency,
        }}
      />
      <Flex mt={2} justify="space-between">
        <Flex>
          <Badge
            background="bg-tertiary"
            color="text-primary"
            opacity={0.5}
            borderRadius={10}
            px={3}
            h="24px"
            onClick={() => setValue('amount', formatBalanceToString(defaultBalance, portfolioCurrency?.decimals ?? 6))}
            borderColor="gray.500 !important"
            border="1px solid"
            cursor="pointer"
          >
            MAX
          </Badge>
          <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(defaultBalance, portfolioCurrency?.symbol)}
          </Text>
        </Flex>
        <NetworkIcons networks={networks} />
      </Flex>
      {parsedAmount !== 0 && (
        <>
          <Text fontWeight={500} mt={6} mb={2}>
            You receive
          </Text>
          <BalanceInput
            name="amountToReceive"
            decimals={navPerShare?.decimals}
            displayDecimals={navPerShare?.decimals}
            placeholder="0.00"
            disabled
            inputGroupProps={{
              endAddon: currencies.receiveCurrency,
            }}
          />
        </>
      )}
      <Button
        colorPalette="yellow"
        type="button"
        onClick={() => setActionType(InvestAction.INVESTOR_REQUIREMENTS)}
        disabled={isDisabled}
        width="100%"
        mt={4}
      >
        Invest
      </Button>
      <InfoWrapper text={infoLabel} type={hasNoInvestmentCurrency ? 'error' : 'info'} />
    </Box>
  )
}
