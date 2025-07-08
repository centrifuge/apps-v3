import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, SubmitButton, useFormContext } from '@centrifuge/forms'
import { Balance, Vault } from '@centrifuge/sdk'
import { usePortfolio, formatBalance, usePoolDetails, useVaultDetails } from '@centrifuge/shared'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { divideBigInts } from '@centrifuge/shared/src/utils/formatting'

interface RedeemAmountProps {
  isDisabled: boolean
  parsedAmount: 0 | Balance
  vault?: Vault
  currencies: { investCurrency: string; receiveCurrency: string }
  setCurrencies: Dispatch<SetStateAction<{ investCurrency: string; receiveCurrency: string }>>
}

export function RedeemAmount({ isDisabled, parsedAmount, vault, currencies, setCurrencies }: RedeemAmountProps) {
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId)
  const { data: vaultDetails } = useVaultDetails(vault)
  const { setValue } = useFormContext()

  const shareClass = pool?.shareClasses.find(
    (sc) => sc.details.id.raw.toString() === vault?.shareClass.id.raw.toString()
  )
  const navPerShare = shareClass?.details.pricePerShare

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const shareAsset = vaultDetails?.shareCurrency.address

  // Get info on the users shares holdings in their wallet
  const portfolioShareAsset = portfolio?.find((asset) => asset.currency.address === shareAsset)
  const portfolioShareCurrency = portfolioShareAsset?.currency
  const defaultShareBalance = portfolioShareAsset?.balance ?? 0

  // Get info on the users investment asset that shares will be converted into
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioInvestmentCurrency = portfolioInvestmentAsset?.currency

  // Calculate and update the amount the user will receive in the investment asset based on shares sold
  useMemo(() => {
    if (parsedAmount === 0 || !shareClass || !navPerShare) {
      return setValue('amountToReceive', '0')
    }

    const redeemAmountDecimals = parsedAmount.decimals
    const redeemAmount = parsedAmount.toBigInt()
    const navPerShareAmount = navPerShare.toBigInt()

    const receiveAmount = divideBigInts(redeemAmount, navPerShareAmount, redeemAmountDecimals).formatToString(
      redeemAmountDecimals
    )

    setValue('amountToReceive', receiveAmount)
  }, [parsedAmount, shareClass, navPerShare])

  useEffect(
    () =>
      setCurrencies({
        investCurrency: shareClass?.details.symbol ?? '',
        receiveCurrency: vaultDetails?.investmentCurrency.symbol ?? '',
      }),
    [shareClass, vaultDetails]
  )

  return (
    <Box>
      <Text fontWeight={500} mb={2}>
        Redeem
      </Text>
      <BalanceInput
        name="redeemAmount"
        decimals={shareClass?.details.pricePerShare.decimals}
        placeholder="0.00"
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
            borderColor="gray.500 !important"
            border="1px solid"
            cursor="pointer"
            onClick={() => setValue('amount', defaultShareBalance.toString())}
          >
            MAX
          </Badge>
          <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(defaultShareBalance, portfolioShareCurrency?.symbol)}
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
              endAddon: currencies.receiveCurrency,
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
