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
import { formatUIBalance } from '@centrifuge/shared'
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
  const { vaultDetails } = useVaultsContext()
  const isSyncInvestVault = vaultDetails?.isSyncInvest || false

  const scId = shareClass?.details.id.toString()
  const token = scId && poolDetails?.metadata?.shareClasses[scId]

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
              145,984.87&nbsp;
            </Text>
            <Text fontSize="24px" textAlign="right">
              USD
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
                  // TODO: is this correct?
                  value: formatUIBalance(shareClass?.details.nav),
                },
                {
                  label: 'Token price (USD)',
                  // TODO: such a big number is breaking UI a lot, need to format it more
                  // value: formatUIBalance(shareClass?.details.pricePerShare),
                  value: '12,194.91',
                },
                {
                  label: 'APY',
                  value: token?.apyPercentage?.toString() || '0%',
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
