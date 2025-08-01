import { divideBigInts, formatBalance } from '@centrifuge/shared'
import { BalanceDisplay } from '@centrifuge/ui'
import { Box, Button, Flex, Grid, Heading, Icon, Spinner, Text } from '@chakra-ui/react'
import { TabProps } from '@components/InvestRedeemSection'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { useVaultsContext } from '@contexts/useVaultsContext'
import { useMemo } from 'react'
import { IoMdTimer } from 'react-icons/io'

export function PendingTab({ isLoading: isTabLoading }: TabProps) {
  const { investment, vaultDetails } = useVaultsContext()
  const { poolDetails } = usePoolsContext()

  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare

  const calculatedInvestSharesEstimate = useMemo(() => {
    if (
      !investment ||
      !investment.pendingInvestCurrency ||
      investment.pendingInvestCurrency.isZero() ||
      !pricePerShare
    ) {
      return undefined
    }

    const investAmountBigint = investment.pendingInvestCurrency.toBigInt()
    const pricePerShareBigint = pricePerShare.toBigInt()

    return divideBigInts(investAmountBigint, pricePerShareBigint, pricePerShare.decimals).formatToString(
      investment.pendingInvestCurrency.decimals,
      2
    )
  }, [investment?.pendingInvestCurrency, pricePerShare])

  const calculatedRedeemAmountEstimate = useMemo(() => {
    if (!investment || !investment?.pendingRedeemShares || investment?.pendingRedeemShares.isZero() || !pricePerShare) {
      return undefined
    }

    return formatBalance(investment.pendingRedeemShares.mul(pricePerShare))
  }, [])

  console.log({ investment, poolShareClass })

  if (isTabLoading) {
    return (
      <Box height="100%" minH="210px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="black.solid" />
      </Box>
    )
  }

  // if ((!investment || (!calculatedInvestSharesEstimate && !calculatedRedeemAmountEstimate)) && !isTabLoading) {
  if (!investment && !isTabLoading) {
    return (
      <Box height="100%" mt={4} minH="210px">
        <Heading fontSize="xl">No pending transactions found.</Heading>
      </Box>
    )
  }

  return (
    <Box p={2} mt={2} height="100%">
      <Flex alignItems="center" gap={2} justifyContent="space-between" mb={8}>
        <Heading>Pending transactions</Heading>
        <Icon size="lg">
          <IoMdTimer color="gray.400" />
        </Icon>
      </Flex>

      <Text fontSize="sm">Investments</Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text fontSize="sm" mt={2} fontWeight="bold">
            {investment?.investmentCurrency.symbol}
          </Text>
          <BalanceDisplay balance={investment?.pendingInvestCurrency} fontSize="sm" />
        </Box>
        <Box textAlign={'right'}>
          <Text fontSize="sm" fontWeight="bold">
            Est. {investment?.shareCurrency.symbol}
          </Text>
          <Text fontSize="sm" mt={2}>
            {calculatedInvestSharesEstimate ?? '0.00'}
          </Text>
        </Box>
      </Grid>

      <Text fontSize="sm" mt={8}>
        Redemptions
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text fontSize="sm" mt={2} fontWeight="bold">
            {investment?.shareCurrency.symbol}
          </Text>
          <BalanceDisplay balance={investment?.pendingRedeemShares} fontSize="sm" />
        </Box>
        <Box textAlign={'right'}>
          <Text fontSize="sm" fontWeight="bold">
            Est. {investment?.investmentCurrency.symbol}
          </Text>
          <Text fontSize="sm" mt={2}>
            {calculatedRedeemAmountEstimate ?? '0.00'}
          </Text>
        </Box>
      </Grid>

      <Flex alignItems="center" justifyContent="space-between" gap="1rem" w="full" mt={8} mb={4}>
        <Button w="calc(50% - 0.5rem)" colorPalette="black">
          Redeem more
        </Button>
        <Button w="calc(50% - 0.5rem)">Invest more</Button>
      </Flex>
    </Box>
  )
}
