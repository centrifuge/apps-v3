import { useMemo, type Dispatch, type SetStateAction } from 'react'
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { Balance, PoolId } from '@centrifuge/sdk'
import { formatBalance, formatBalanceAbbreviated, usePortfolio, usePoolDetails } from '@centrifuge/shared'
import { NetworkIcons, type Network } from '@components/NetworkIcon'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { infoText } from '@utils/infoText'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { VaultDetails } from '@utils/types'

const networks: Network[] = ['ethereum', 'arbitrum', 'celo', 'base']

interface InvestAmountProps {
  parsedAmount: 0 | Balance
  vaultDetails?: VaultDetails
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestAmount({ parsedAmount, vaultDetails, setActionType }: InvestAmountProps) {
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId)
  const { setValue } = useFormContext()

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const minAmount = pool?.metadata?.shareClasses
    ? (Object.values(pool?.metadata?.shareClasses || {})[0].minInitialInvestment ?? 0)
    : 0

  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioCurrency = portfolioInvestmentAsset?.currency
  const portfolioBalance = portfolioInvestmentAsset?.balance

  const shareClass = pool?.shareClasses.find((asset) => asset.shareClass.pool.chainId === investmentCurrencyChainId)
  const navPerShare = shareClass?.details.navPerShare

  const hasInvestmentCurrency = portfolioCurrency?.chainId === vaultDetails?.investmentCurrency?.chainId
  const hasNoInvestmentCurrency = !hasInvestmentCurrency || portfolioBalance?.isZero
  const infoLabel = hasNoInvestmentCurrency ? infoText().portfolioMissingInvestmentCurrency : infoText().redeem

  useMemo(() => {
    if (parsedAmount === 0 || !shareClass || navPerShare === undefined) {
      return setValue('amountToReceive', '0')
    }

    const redeemAmount = parsedAmount.mul(navPerShare)
    setValue('amountToReceive', redeemAmount.toFloat().toString())
  }, [parsedAmount, shareClass, navPerShare])

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
        decimals={6}
        displayDecimals={6}
        placeholder="0.00"
        // disabled={!hasInvestmentCurrency}
        inputGroupProps={{
          endAddon: `${portfolioCurrency?.symbol || 'USDC'}`,
        }}
      />
      <Flex mt={2} justify="space-between">
        <Flex>
          <Badge background="bg-tertiary" color="text-primary" opacity={0.5} borderRadius={10} px={3} h="24px">
            MAX
          </Badge>
          <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(portfolioBalance ?? 0, portfolioCurrency?.symbol)}
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
              endAddon: 'deJTRYS',
            }}
          />
        </>
      )}
      <Button
        colorPalette="yellow"
        type="button"
        onClick={() => setActionType(InvestAction.INVESTOR_REQUIREMENTS)}
        disabled={parsedAmount === 0}
        width="100%"
        mt={4}
      >
        Invest
      </Button>
      <InfoWrapper text={infoLabel} type={hasNoInvestmentCurrency ? 'error' : 'info'} />
    </Box>
  )
}
