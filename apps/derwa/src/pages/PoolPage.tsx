import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { FAQSection } from '@components/FAQSection'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolPerformanceChart } from '@components/PoolPerformanceChart'
import { UnderlyingCollateralSection } from '@components/UnderlyingCollateralSection'
import { LandingPageSkeleton } from '@components/Skeletons/LandingPageSkeleton'
import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { usePoolDetails } from '@centrifuge/shared'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { useParams } from 'react-router'
import { useEffect } from 'react'

export default function PoolPage() {
  const { selectedPoolId, isLoading: isPoolsLoading, setSelectedPoolId, pools } = usePoolsContext()
  const { data: pool, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId as PoolId)
  const params = useParams()
  console.log({ params })

  // This correctly resets the pool if there is a page refresh
  useEffect(() => {
    if (selectedPoolId && selectedPoolId.raw.toString() !== params.poolId) {
      const poolId = pools?.find((pool) => pool.id.raw.toString() === params.poolId)?.id
      if (poolId) setSelectedPoolId(poolId)
    }
  }, [pools, params, selectedPoolId])

  if (isPoolsLoading || isPoolDetailsLoading) {
    return <LandingPageSkeleton />
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Link to="/">
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
