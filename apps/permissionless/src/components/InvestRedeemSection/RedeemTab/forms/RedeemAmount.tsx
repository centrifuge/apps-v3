import { useMemo } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, SubmitButton, useFormContext } from '@centrifuge/forms'
import { Balance } from '@centrifuge/sdk'
import { usePortfolio, formatBalance, usePoolDetails } from '@centrifuge/shared'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { VaultDetails } from '@utils/types'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { formatDivideBigInts } from '@utils/numberUtils'

interface RedeemAmountProps {
  isDisabled: boolean
  parsedAmount: 0 | Balance
  vaultDetails?: VaultDetails
}

export function RedeemAmount({ isDisabled, parsedAmount, vaultDetails }: RedeemAmountProps) {
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId)
  const { setValue } = useFormContext()

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const shareAsset = vaultDetails?.shareCurrency.address

  // Get info on the users shares holdings in their wallet
  const portfolioShareAsset = portfolio?.find((asset) => asset.currency.address === shareAsset)
  const portfolioShareCurrency = portfolioShareAsset?.currency
  const portfolioShareBalance = portfolioShareAsset?.balance

  // Get info on the users investment asset that shares will be converted into
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioInvestmentCurrency = portfolioInvestmentAsset?.currency

  // Get the share class info for handling conversion calculation
  const shareClass = pool?.shareClasses.find((asset) => asset.shareClass.pool.chainId === investmentCurrencyChainId)
  const navPerShare = shareClass?.details.navPerShare

  // Calculate and update the amount the user will receive in the investment asset based on shares sold
  useMemo(() => {
    if (parsedAmount === 0 || !shareClass || !navPerShare) {
      return setValue('amountToReceive', '0')
    }

    const redeemAmountDecimals = portfolioShareCurrency?.decimals ?? 18
    const redeemAmount = parsedAmount.toBigInt()
    const navPerShareAmount = navPerShare.toBigInt()

    const receiveAmount = formatDivideBigInts(
      redeemAmount,
      navPerShareAmount,
      redeemAmountDecimals,
      portfolioInvestmentCurrency?.decimals
    )
    setValue('amountToReceive', receiveAmount)
  }, [parsedAmount, shareClass, navPerShare])

  return (
    <Box>
      <Text fontWeight={500} mb={2}>
        Redeem
      </Text>
      <BalanceInput
        name="amount"
        decimals={portfolioShareCurrency?.decimals ?? 18}
        placeholder="0.00"
        inputGroupProps={{
          endAddon: 'deJTRYS',
        }}
        // disabled={!portfolioShareCurrency}
      />
      <Flex mt={2} justify="space-between">
        <Flex>
          <Badge background="bg-tertiary" color="text-primary" opacity={0.5} borderRadius={10} px={3} h="24px">
            MAX
          </Badge>
          <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(portfolioShareBalance ?? 0, portfolioShareCurrency?.symbol)}
          </Text>
        </Flex>
      </Flex>
      {parsedAmount !== 0 && (
        <>
          <Text fontWeight={500} mt={6} mb={2}>
            You receive
          </Text>
          <BalanceInput
            name="amountToReceive"
            placeholder="0.00"
            decimals={portfolioInvestmentCurrency?.decimals}
            disabled
            inputGroupProps={{
              endAddon: `${portfolioInvestmentCurrency?.symbol || 'USDC'}`,
            }}
          />
        </>
      )}
      <SubmitButton colorPalette="yellow" disabled={isDisabled} width="100%">
        Redeem
      </SubmitButton>
      {parsedAmount === 0 && <InfoWrapper text={infoText().redeem} />}
    </Box>
  )
}
