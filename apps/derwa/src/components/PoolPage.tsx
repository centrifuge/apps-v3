import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { FAQSection } from '@components/FAQSection'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolPerformanceChart } from '@components/PoolPerformanceChart'
import { UnderlyingCollateralSection } from '@components/UnderlyingCollateralSection'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'

export const PoolPage = () => {
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool, isLoading } = usePoolDetails(selectedPoolId as PoolId)

  if (isLoading || !pool) return null

  return (
    <Box marginTop={8}>
      <Flex
        justifyContent={{ base: 'center', sm: 'center', md: 'space-between' }}
        mb={8}
        flexDirection={{ base: 'column', sm: 'column', md: 'row' }}
      >
        <Heading alignSelf={{ base: 'center', sm: 'center', md: 'flex-end' }} size="2xl">
          {pool?.metadata?.pool?.name}
        </Heading>
        <Stack gap={0} alignItems={{ base: 'center', sm: 'center', md: 'flex-end' }}>
          <Text>Investment position</Text>
          <Heading size="2xl">0 USDC</Heading>
        </Stack>
      </Flex>
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
