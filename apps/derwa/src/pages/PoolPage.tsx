import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolPageSkeleton } from '@components/Skeletons/PoolPageSkeleton'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { routePaths } from '@routes/routePaths'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolDetailsSummary } from '@components/pools/PoolDetails/PoolDetailsSummary'
import { PoolDetailsPermissioned } from '@components/pools/PoolDetails/PoolDetailsPermissioned'
import { PoolDetailsPermissionless } from '@components/pools/PoolDetails/PoolDetailsPermissionless'
import { formatBalance, formatBigintToString } from '@centrifuge/shared'
import { useVaultsContext } from '@contexts/useVaultsContext'

export default function PoolPage() {
  const {
    isLoading: isPoolsLoading,
    poolDetails,
    isPoolDetailsLoading,
    networks,
    isNetworksLoading,
    shareClass,
  } = usePoolsContext()
  const { investment, vaultDetails } = useVaultsContext()
  const isSyncInvestVault = vaultDetails?.isSyncInvest || false
  const apy = shareClass?.details.apyPercentage?.toString()

  if (isPoolsLoading || isPoolDetailsLoading || isNetworksLoading) {
    return <PoolPageSkeleton />
  }

  // TODO: handle case when data is not available
  if (!poolDetails || !networks || !shareClass) {
    return null
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Link to={routePaths.home}>
          <Flex alignItems="center">
            <IoArrowBack />
            <Heading size="2xl" ml={8}>
              {poolDetails?.metadata?.pool.name}
            </Heading>
          </Flex>
        </Link>
        <Box mt={4}>
          <Text fontSize="12px" color="black" width="auto" textAlign="right">
            Your current holdings in {poolDetails?.metadata?.pool.name}
          </Text>
          <Flex align={'flex-end'} justifyContent="flex-end">
            <Text fontSize="24px" fontWeight="bold" textAlign="right">
              {formatBalance(investment?.investmentCurrencyBalance ?? 0, 'USD', 2)}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Box marginTop={8}>
        <Grid templateColumns={{ base: '1fr', sm: '1fr', md: '1fr', lg: '6fr 4fr' }} gap={10}>
          <Box minW={0}>
            <PoolDetailsSummary
              items={[
                {
                  label: 'TVL (USD)',
                  value: '450,000,000',
                },
                {
                  label: 'Token price (USD)',
                  value: formatBigintToString(
                    shareClass?.details.pricePerShare.toBigInt(),
                    shareClass?.details.pricePerShare.decimals,
                    2
                  ),
                },
                {
                  label: 'APY',
                  value: apy ? `${apy}%` : '0%',
                },
              ]}
            />

            {!isSyncInvestVault && (
              <PoolDetailsPermissioned poolDetails={poolDetails} networks={networks} shareClass={shareClass} />
            )}
            {isSyncInvestVault && <PoolDetailsPermissionless poolDetails={poolDetails} />}
          </Box>

          <Box height="fit-content" position="sticky" top={8}>
            <InvestRedeemSection pool={poolDetails} />
          </Box>
        </Grid>
      </Box>
    </>
  )
}
