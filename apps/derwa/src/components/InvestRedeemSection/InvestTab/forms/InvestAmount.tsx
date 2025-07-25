import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react'
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, useFormContext } from '@centrifuge/forms'
import { Balance, PoolId, PoolNetwork, Vault } from '@centrifuge/sdk'
import { usePortfolio, usePoolDetails, useVaultsDetails } from '@centrifuge/shared'
import { NetworkIcons } from '@centrifuge/ui'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { infoText } from '@utils/infoText'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { VaultDetails } from '@utils/types'
import { debounce, formatBalance, formatBalanceToString } from '@centrifuge/shared'
import { useSwitchChain } from 'wagmi'

interface InvestAmountProps {
  isDisabled: boolean
  maxInvestAmount: string
  networks?: PoolNetwork[]
  parsedInvestAmount: 0 | Balance
  vaultDetails?: VaultDetails
  setActionType: Dispatch<SetStateAction<InvestActionType>>
  setVault: Dispatch<Vault>
  vaults: Vault[]
}

export function InvestAmount({
  isDisabled,
  maxInvestAmount,
  networks,
  parsedInvestAmount,
  vaultDetails,
  setActionType,
  vaults,
}: InvestAmountProps) {
  const { data: vaultsDetails } = useVaultsDetails(vaults)
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = usePoolsContext()
  const { data: pool } = usePoolDetails(selectedPoolId as PoolId)
  const { setValue } = useFormContext()
  const { switchChain } = useSwitchChain()
  const networkIds = networks?.map((network) => network.chainId)

  // Investment Currencies for changing asset to invest
  const investmentCurrencies = vaultsDetails?.map((vault) => ({
    label: vault.investmentCurrency.symbol,
    value: vault.investmentCurrency.chainId,
  }))

  const changeVault = (value: number) => switchChain({ chainId: value })

  const investmentCurrencyChainId = vaultDetails?.investmentCurrency?.chainId

  // Get user investment asset info
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.chainId === investmentCurrencyChainId)
  const portfolioCurrency = portfolioInvestmentAsset?.currency
  const portfolioBalance = portfolioInvestmentAsset?.balance

  // Get the share class info for calculating shares amount to receive
  const shareClass = pool?.shareClasses.find((asset) => asset.shareClass.pool.chainId === investmentCurrencyChainId)
  const pricePerShare = shareClass?.details.pricePerShare

  // Check if the user has the necessary investment currency to invest
  const hasInvestmentCurrency = portfolioCurrency?.chainId === vaultDetails?.investmentCurrency?.chainId
  const hasNoInvestmentCurrency = !hasInvestmentCurrency || portfolioBalance?.isZero()
  const infoLabel = hasNoInvestmentCurrency ? infoText().portfolioMissingInvestmentCurrency : infoText().redeem

  // Calculate and update amount to receive based on user input on amount to invest
  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, investInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !investInputAmount || !pricePerShare) return

      const calculatedReceiveAmount = formatBalanceToString(
        investInputAmount.mul(pricePerShare),
        investInputAmount.decimals
      )
      setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 500), [calculateReceiveAmount])

  const setMaxInvestAmount = useCallback(() => {
    if (!portfolioBalance || !maxInvestAmount || !pricePerShare) return
    setValue('investAmount', maxInvestAmount)
    const calculatedReceiveAmount = formatBalanceToString(
      portfolioBalance.mul(pricePerShare),
      portfolioBalance.decimals
    )
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxInvestAmount])

  return (
    <Box>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight={500}>You pay</Text>
      </Flex>
      <BalanceInput
        name="investAmount"
        decimals={portfolioCurrency?.decimals}
        placeholder="0.00"
        selectOptions={investmentCurrencies}
        onSelectChange={changeVault}
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
            onClick={setMaxInvestAmount}
            borderColor="gray.500 !important"
            border="1px solid"
            cursor="pointer"
          >
            MAX
          </Badge>
          <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(portfolioBalance ?? 0, portfolioCurrency?.symbol)}
          </Text>
        </Flex>
        <NetworkIcons networkIds={networkIds} />
      </Flex>
      {parsedInvestAmount !== 0 && (
        <>
          <Text fontWeight={500} mt={6} mb={2}>
            You receive
          </Text>
          <BalanceInput
            name="receiveAmount"
            decimals={pricePerShare?.decimals}
            displayDecimals={pricePerShare?.decimals}
            placeholder="0.00"
            disabled
            currency={vaultDetails?.shareCurrency.symbol}
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
