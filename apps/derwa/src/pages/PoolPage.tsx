import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { FAQSection } from '@components/FAQSection'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolPerformanceChart } from '@components/pools/PoolPerformanceChart'
import { UnderlyingCollateralSection } from '@components/UnderlyingCollateralSection'
import { PoolPageSkeleton } from '@components/Skeletons/PoolPageSkeleton'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { routePaths } from '@routes/routePaths'

export default function PoolPage() {
  const { selectedPoolId, isLoading: isPoolsLoading } = usePoolsContext()
  const { data: pool, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId as PoolId)

  if (isPoolsLoading || isPoolDetailsLoading) {
    return <PoolPageSkeleton />
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Link to={routePaths.home}>
          <Flex alignItems="center">
            <IoArrowBack />
            <Heading size="2xl" ml={8}>
              {pool?.metadata?.pool.name}
            </Heading>
          </Flex>
        </Link>
        <Box>
          <Heading size="xl" color="black" width="auto" textAlign="center">
            Current Holdings
          </Heading>
          <Text>$237,890</Text>
        </Box>
      </Flex>
      <Box marginTop={8}>
        <Grid templateColumns={{ base: '1fr', sm: '1fr', md: '1fr', lg: '6fr 4fr' }} gap={10} alignItems="stretch">
          <PoolPerformanceChart pool={pool} />
          <InvestRedeemSection pool={pool} />
        </Grid>
        <Box mt={8}>
          <UnderlyingCollateralSection />
        </Box>
        <Box mt={8}>
          <FAQSection />
        </Box>
      </Box>
    </>
  )
}
