import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { FAQSection } from '@components/FAQSection'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolPerformanceChart } from '@components/PoolPerformanceChart'
import { UnderlyingCollateralSection } from '@components/UnderlyingCollateralSection'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { LandingPageSkeleton } from '@components/Skeletons/LandingPageSkeleton'

export default function PoolPage() {
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool, isLoading } = usePoolDetails(selectedPoolId as PoolId)

  if (isLoading || !pool) {
    return <LandingPageSkeleton />
  }

  return (
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
  )
}
