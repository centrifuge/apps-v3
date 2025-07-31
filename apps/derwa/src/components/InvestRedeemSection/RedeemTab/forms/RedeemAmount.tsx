import { useCallback, useMemo } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, SubmitButton, useFormContext } from '@centrifuge/forms'
import { Balance, PoolNetwork } from '@centrifuge/sdk'
import { debounce, formatBalanceToString, formatBalance, divideBigInts } from '@centrifuge/shared'
import { NetworkIcons } from '@centrifuge/ui'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { useVaultsContext } from '@contexts/useVaultsContext'

interface RedeemAmountProps {
  isDisabled: boolean
  maxRedeemAmount: string
  networks?: PoolNetwork[]
  parsedRedeemAmount: 0 | Balance
}

export function RedeemAmount({ isDisabled, maxRedeemAmount, networks, parsedRedeemAmount }: RedeemAmountProps) {
  const { poolDetails } = usePoolsContext()
  const { investment, vaults, vaultDetails, vaultsDetails, setVault } = useVaultsContext()
  const { setValue } = useFormContext()

  // Get networkIds and currencies for receiveAmount select currency list
  const networkIds = networks?.map((network) => network.chainId)
  const investmentCurrencies = vaultsDetails?.map((vault) => ({
    label: vault.investmentCurrency.symbol,
    value: vault.address,
  }))

  // Get the pricePerShare
  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare

  // Get info on the users shares holdings in their wallet
  const shareCurrencySymbol = investment?.shareCurrency.symbol ?? ''
  const maxRedeemBalance = investment?.shareBalance ?? 0
  const hasRedeemableShares = !investment?.shareBalance.isZero()

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, redeemInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !redeemInputAmount || !pricePerShare) return

      const calculatedReceiveAmount = formatBalanceToString(
        redeemInputAmount.mul(pricePerShare),
        redeemInputAmount.decimals
      )
      setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 500), [calculateReceiveAmount])

  const calculateRedeemAmountValue = useCallback(
    (receiveInputAmount?: Balance) => {
      if (!receiveInputAmount || !pricePerShare) {
        return ''
      }

      const receiveAmountDecimals = receiveInputAmount.decimals
      const receiveAmountBigint = receiveInputAmount.toBigInt()
      const pricePerShareBigint = pricePerShare.toBigInt()

      return divideBigInts(receiveAmountBigint, pricePerShareBigint, pricePerShare.decimals).formatToString(
        receiveAmountDecimals,
        pricePerShare?.decimals
      )
    },
    [pricePerShare]
  )

  const calculateRedeemAmount = useCallback(
    (inputStringValue: string, receiveInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !receiveInputAmount || !pricePerShare) {
        return setValue('redeemAmount', '')
      }

      const calculatedRedeemAmount = calculateRedeemAmountValue(receiveInputAmount)

      return setValue('redeemAmount', calculatedRedeemAmount)
    },
    [pricePerShare, setValue]
  )

  const debouncedCalculateRedeemAmount = useMemo(() => debounce(calculateRedeemAmount, 500), [calculateRedeemAmount])

  const changeVault = useCallback(
    (value: string | number) => {
      const newVault = vaults?.find((vault) => vault.address === value)
      setVault(newVault)
    },
    [vaults]
  )

  const setMaxRedeemAmount = useCallback(() => {
    if (!maxRedeemAmount || !pricePerShare || !hasRedeemableShares || maxRedeemBalance === 0) return

    const calculatedReceiveAmount = formatBalanceToString(
      maxRedeemBalance.mul(pricePerShare),
      maxRedeemBalance.decimals
    )

    setValue('redeemAmount', maxRedeemAmount)
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxRedeemAmount, pricePerShare])

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        <Box>
          <Text fontWeight={500} mb={2}>
            Redeem
          </Text>
          <BalanceInput
            name="redeemAmount"
            decimals={vaultDetails?.shareCurrency.decimals}
            placeholder="0.00"
            onChange={debouncedCalculateReceiveAmount}
            currency={shareCurrencySymbol}
            disabled={!hasRedeemableShares}
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
                decimals={vaultDetails?.investmentCurrency.decimals}
                onChange={debouncedCalculateRedeemAmount}
                selectOptions={investmentCurrencies}
                onSelectChange={changeVault}
              />
            </>
          )}
        </Box>
        <Box>
          <SubmitButton colorPalette="yellow" disabled={isDisabled} width="100%" mt={6}>
            Redeem
          </SubmitButton>
          {!hasRedeemableShares ? (
            <InfoWrapper text="You do not have any shares available to redeem" type="info" />
          ) : null}
        </Box>
      </Flex>
    </Box>
  )
}
