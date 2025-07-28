import { useCallback, useMemo } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, SubmitButton, useFormContext } from '@centrifuge/forms'
import { Balance, PoolNetwork, Price } from '@centrifuge/sdk'
import { divideBigInts } from '@centrifuge/shared'
import { NetworkIcons } from '@centrifuge/ui'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { infoText } from '@utils/infoText'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { debounce, formatBalance, formatBalanceToString } from '@centrifuge/shared'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'
import { useVaultsContext } from '@contexts/useVaultsContext'

interface InvestAmountProps {
  isDisabled: boolean
  maxInvestAmount: string
  networs?: PoolNetwork[]
  parsedInvestAmount: 0 | Balance
}

export function InvestAmount({ isDisabled, maxInvestAmount, parsedInvestAmount }: InvestAmountProps) {
  const { poolDetails, networks } = usePoolsContext()
  const { vaultDetails, vaultsDetails, vaults, setVault } = useVaultsContext()
  const { portfolioInvestmentCurrency, portfolioBalance, hasInvestmentCurrency } = useGetPortfolioDetails(vaultDetails)
  const { setValue } = useFormContext()
  const networkIds = networks?.map((network) => network.chainId)

  // Investment Currencies for changing asset to invest
  const investmentCurrencies = vaultsDetails?.map((vault) => ({
    label: vault.investmentCurrency.symbol,
    value: vault.address,
  }))

  // Get the share class info for calculating shares amount to receive
  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare

  const calculateReceiveAmountValue = useCallback(
    (investBalance: Balance, pricePerShare?: Price) => {
      if (!investBalance || !pricePerShare) {
        return ''
      }

      const investAmountDecimals = investBalance.decimals
      const investAmountBigint = investBalance.toBigInt()
      const pricePerShareBigint = pricePerShare.toBigInt()

      return divideBigInts(investAmountBigint, pricePerShareBigint, pricePerShare.decimals).formatToString(
        investAmountDecimals,
        portfolioInvestmentCurrency?.decimals
      )
    },
    [portfolioInvestmentCurrency?.decimals]
  )

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, investInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !investInputAmount || !pricePerShare) {
        return setValue('receiveAmount', '')
      }

      const calculatedReceiveAmount = calculateReceiveAmountValue(investInputAmount, pricePerShare)
      return setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 500), [calculateReceiveAmount])

  const changeVault = useCallback(
    (value: string | number) => {
      const newVault = vaults?.find((vault) => vault.address === value)
      setVault(newVault)
    },
    [vaults]
  )

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
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%" pb={6}>
        <Box>
          <Text fontWeight={500}>You pay</Text>
          <BalanceInput
            name="investAmount"
            decimals={vaultDetails?.investmentCurrency.decimals}
            placeholder="0.00"
            selectOptions={investmentCurrencies}
            onSelectChange={changeVault}
            onChange={debouncedCalculateReceiveAmount}
            disabled={!hasInvestmentCurrency}
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
                {formatBalance(portfolioBalance ?? 0, portfolioInvestmentCurrency?.symbol)}
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
                decimals={vaultDetails?.shareCurrency.decimals}
                placeholder="0.00"
                disabled
                currency={vaultDetails?.shareCurrency.symbol}
              />
            </>
          )}
        </Box>
        <Box>
          <SubmitButton colorPalette="yellow" width="100%" disabled={isDisabled} mt={6}>
            Invest
          </SubmitButton>
          {!hasInvestmentCurrency ? (
            <InfoWrapper text={infoText().portfolioMissingInvestmentCurrency} type="error" />
          ) : null}
        </Box>
      </Flex>
    </Box>
  )
}
