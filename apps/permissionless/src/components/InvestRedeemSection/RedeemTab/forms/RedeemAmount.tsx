import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, SubmitButton, useFormContext } from '@centrifuge/forms'
import { Balance, PoolId, PoolNetwork, Vault } from '@centrifuge/sdk'
import { usePortfolio, formatBalance, usePoolDetails, useVaultDetails } from '@centrifuge/shared'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { divideBigInts, formatBalanceToString } from '@centrifuge/shared/src/utils/formatting'
import { debounce } from '@utils/debounce'
import { NetworkIcons } from '@centrifuge/ui'

interface RedeemAmountProps {
  currencies: { investCurrency: string; receiveCurrency: string }
  isDisabled: boolean
  networks: PoolNetwork[]
  parsedRedeemAmount: 0 | Balance
  vault?: Vault
  vaults?: Vault[]
  setCurrencies: Dispatch<SetStateAction<{ investCurrency: string; receiveCurrency: string }>>
}

export function RedeemAmount({
  currencies,
  isDisabled,
  networks,
  parsedRedeemAmount,
  vault,
  vaults,
  setCurrencies,
}: RedeemAmountProps) {
  // const { data: vaultsDetails } = useVaultsDetails(vaults)
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId as PoolId)
  const { data: vaultDetails } = useVaultDetails(vault)
  const { setValue } = useFormContext()
  const networkIds = networks?.map((network) => network.chainId)

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

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, redeemInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !redeemInputAmount || !navPerShare) {
        return setValue('receiveAmount', '0')
      }

      const redeemAmountDecimals = redeemInputAmount.decimals
      const redeemAmount = redeemInputAmount.toBigInt()
      const navPerShareAmount = navPerShare.toBigInt()
      const calculatedReceiveAmount = divideBigInts(
        redeemAmount,
        navPerShareAmount,
        redeemAmountDecimals
      ).formatToString(redeemAmountDecimals)

      return setValue('receiveAmount', calculatedReceiveAmount)
    },
    [navPerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 500), [calculateReceiveAmount])

  const calculateRedeemAmount = useCallback(
    (inputStringValue: string, receiveInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !receiveInputAmount || !navPerShare) {
        return setValue('redeemAmount', '0')
      }

      const calculatedRedeemAmount = formatBalanceToString(
        receiveInputAmount.mul(navPerShare),
        receiveInputAmount.decimals
      )
      return setValue('redeemAmount', calculatedRedeemAmount)
    },
    [navPerShare, setValue]
  )

  const debouncedCalculateRedeemAmount = useMemo(() => debounce(calculateRedeemAmount, 500), [calculateRedeemAmount])

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
        onChange={debouncedCalculateReceiveAmount}
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
        <NetworkIcons networkIds={networkIds} />
      </Flex>
      {parsedRedeemAmount !== 0 && (
        <>
          <Text fontWeight={500} mt={6} mb={2}>
            You receive
          </Text>
          <BalanceInput
            name="receiveAmount"
            placeholder="0.00"
            decimals={portfolioInvestmentCurrency?.decimals}
            inputGroupProps={{
              endAddon: currencies.receiveCurrency,
            }}
            onChange={debouncedCalculateRedeemAmount}
          />
        </>
      )}
      <SubmitButton colorPalette="yellow" disabled={isDisabled} width="100%">
        Redeem
      </SubmitButton>
      {parsedRedeemAmount === 0 && <InfoWrapper text={infoText().redeem} />}
    </Box>
  )
}
