import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { LandingPageSkeleton } from '@components/Skeletons/LandingPageSkeleton'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { routePaths } from '@routes/routePaths'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolDetailsSummary } from '@components/PoolDetails/PoolDetailsSummary'
import { PoolDetailsPermissioned } from '@components/PoolDetails/PoolDetailsPermissioned'
import { PoolDetailsPermissionless } from '@components/PoolDetails/PoolDetailsPermissionless'

export default function PoolPage() {
  const { selectedPoolId, isLoading: isPoolsLoading } = usePoolsContext()
  const { data: pool, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId as PoolId)

  // TODO: This should come from SDK metadata, will be added in the next version
  const poolType = pool?.metadata?.pool.type || 'open'

  // TODO: pull all the needed data from SDK and replace hardcoded values

  if (isPoolsLoading || isPoolDetailsLoading) {
    return <LandingPageSkeleton />
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
        <Box mt={4}>
          <Text fontSize="12px" color="black" width="auto" textAlign="right">
            Your current holdings in {pool?.metadata?.pool.name}
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
                  value: '448,663,319',
                },
                {
                  label: 'Token price (USD)',
                  value: '12,194.91',
                },
                {
                  label: 'APY',
                  value: '2.54%',
                },
              ]}
            />

            {poolType === 'open' && <PoolDetailsPermissioned />}
            {poolType === 'closed' && <PoolDetailsPermissionless />}
          </Box>

          <Box maxHeight={'350px'} position={'sticky'} top={8}>
            <InvestRedeemSection pool={pool} />
          </Box>
        </Grid>
      </Box>
    </>
  )
}
