import { useCallback, useMemo } from 'react'
import { useSwitchChain } from 'wagmi'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, SubmitButton, useFormContext } from '@centrifuge/forms'
import { Balance, PoolId, PoolNetwork, Price, Vault } from '@centrifuge/sdk'
import {
  debounce,
  divideBigInts,
  formatBalanceToString,
  usePortfolio,
  formatBalance,
  usePoolDetails,
  useVaultDetails,
  useVaultsDetails,
  useInvestment,
} from '@centrifuge/shared'
import { NetworkIcons } from '@centrifuge/ui'
import { usePoolsContext } from '@contexts/usePoolsContext'

interface RedeemAmountProps {
  isDisabled: boolean
  maxRedeemAmount: string
  networks?: PoolNetwork[]
  parsedRedeemAmount: 0 | Balance
  vault?: Vault
  vaults?: Vault[]
}

export function RedeemAmount({
  isDisabled,
  maxRedeemAmount,
  networks,
  parsedRedeemAmount,
  vault,
  vaults,
}: RedeemAmountProps) {
  const { data: vaultsDetails } = useVaultsDetails(vaults)
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = usePoolsContext()
  const { data: pool } = usePoolDetails(selectedPoolId as PoolId)
  const { data: vaultDetails } = useVaultDetails(vault)
  const { switchChain } = useSwitchChain()
  const { setValue } = useFormContext()
  const { data: investment } = useInvestment(vault)

  // Get networkIds and currencies for receiveAmount select currency list
  const networkIds = networks?.map((network) => network.chainId)
  const investmentCurrencies = vaultsDetails?.map((vault) => ({
    label: vault.investmentCurrency.symbol,
    value: vault.investmentCurrency.chainId,
  }))

  // Get the pricePerShare
  const shareClass = pool?.shareClasses.find((sc) => sc.details.id.toString() === vault?.shareClass.id.toString())
  const pricePerShare = shareClass?.details.pricePerShare

  // Get info on the users shares holdings in their wallet
  const shareCurrencySymbol = investment?.shareCurrency.symbol ?? ''
  const maxRedeemBalance = investment?.shareBalance ?? 0

  // Get info on the users investment asset that shares will be converted into
  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioInvestmentCurrency = portfolioInvestmentAsset?.currency

  const calculateReceiveAmountValue = useCallback(
    (redeemBalance: Balance, pricePerShare?: Price) => {
      if (!redeemBalance || !pricePerShare) {
        return ''
      }

      const redeemAmountDecimals = redeemBalance.decimals
      const redeemAmountBigint = redeemBalance.toBigInt()
      const pricePerShareBigint = pricePerShare.toBigInt()

      return divideBigInts(redeemAmountBigint, pricePerShareBigint, redeemAmountDecimals).formatToString(
        redeemAmountDecimals,
        portfolioInvestmentCurrency?.decimals
      )
    },
    [portfolioInvestmentCurrency?.decimals]
  )

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, redeemInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !redeemInputAmount || !pricePerShare) {
        return setValue('receiveAmount', '')
      }

      const calculatedReceiveAmount = calculateReceiveAmountValue(redeemInputAmount, pricePerShare)
      return setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 500), [calculateReceiveAmount])

  const calculateRedeemAmount = useCallback(
    (inputStringValue: string, receiveInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !receiveInputAmount || !pricePerShare) {
        return setValue('redeemAmount', '')
      }

      const calculatedRedeemAmount = formatBalanceToString(
        receiveInputAmount.mul(pricePerShare),
        receiveInputAmount.decimals
      )
      return setValue('redeemAmount', calculatedRedeemAmount)
    },
    [pricePerShare, setValue]
  )

  const debouncedCalculateRedeemAmount = useMemo(() => debounce(calculateRedeemAmount, 500), [calculateRedeemAmount])

  const changeVault = (value: number) => switchChain({ chainId: value })

  const setMaxRedeemAmount = useCallback(() => {
    if (!maxRedeemAmount || !pricePerShare || maxRedeemBalance === 0) return

    const calculatedReceiveAmount = calculateReceiveAmountValue(maxRedeemBalance, pricePerShare)
    setValue('redeemAmount', maxRedeemAmount)
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxRedeemAmount, pricePerShare])

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%" mb={2} pb={6}>
        <Box>
          <Text fontWeight={500} mb={2}>
            Redeem
          </Text>
          <BalanceInput
            name="redeemAmount"
            decimals={shareClass?.details.pricePerShare.decimals}
            placeholder="0.00"
            onChange={debouncedCalculateReceiveAmount}
            currency={shareCurrencySymbol}
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
                onClick={setMaxRedeemAmount}
              >
                MAX
              </Badge>
              <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
                {formatBalance(maxRedeemBalance, shareCurrencySymbol)}
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
                onChange={debouncedCalculateRedeemAmount}
                selectOptions={investmentCurrencies}
                onSelectChange={changeVault}
              />
            </>
          )}
        </Box>
        <SubmitButton colorPalette="yellow" disabled={isDisabled} width="100%">
          Redeem
        </SubmitButton>
      </Flex>
    </Box>
  )
}
