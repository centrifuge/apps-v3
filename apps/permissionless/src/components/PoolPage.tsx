import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { useSelectedPoolContext } from '../contexts/useSelectedPoolContext'
import { usePoolDetails } from '@centrifuge/shared'
import { PoolId } from '@centrifuge/sdk'
import { PoolPerformanceChart } from './PoolPerformanceChart'
import { InvestRedeemSection } from './InvestRedeemSection'
import { UnderlyingCollateralSection } from './UnderlyingCollateralSection'
import { FAQSection } from './FAQSection'

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
