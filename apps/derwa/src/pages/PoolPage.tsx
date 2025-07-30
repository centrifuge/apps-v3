import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolPageSkeleton } from '@components/Skeletons/PoolPageSkeleton'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { routePaths } from '@routes/routePaths'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolDetailsSummary } from '@components/pools/PoolDetails/PoolDetailsSummary'
import { PoolDetailsPermissionless } from '@components/pools/PoolDetails/PoolDetailsPermissionless'
import { formatBalance } from '@centrifuge/shared'
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
  const { investment } = useVaultsContext()
  // TODO: Determine if vault is defi or permissioned (KYB)
  // const isSyncInvestVault = vaultDetails?.isSyncInvest || false

  if (isPoolsLoading || isPoolDetailsLoading || isNetworksLoading) {
    return <PoolPageSkeleton />
  }

  if (!poolDetails || !networks || !shareClass) {
    return <BackLink heading="Sorry, no pool data available at this time." />
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <BackLink heading={poolDetails.metadata?.pool.name ?? 'Back to pools'} />
        <Box mt={4}>
          <Text fontSize=".75rem" color="black" width="auto" textAlign="right">
            Your current holdings in {poolDetails?.metadata?.pool.name}
          </Text>
          <Flex align={'flex-end'} justifyContent="flex-end">
            <Text fontSize="xl" fontWeight="bold" textAlign="right">
              {formatBalance(investment?.shareBalance ?? 0, investment?.shareCurrency.symbol ?? '', 0)}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Box marginTop={8}>
        <Grid templateColumns={{ base: '1fr', sm: '1fr', md: '1fr', lg: '6fr 4fr' }} gap={10}>
          <Box minW={0}>
            <PoolDetailsSummary />
            <PoolDetailsPermissionless />
            {/* {!isSyncInvestVault ? <PoolDetailsPermissioned /> : <PoolDetailsPermissionless />} */}
          </Box>

          <Box height="fit-content" position="sticky" top={8}>
            <InvestRedeemSection pool={poolDetails} />
          </Box>
        </Grid>
      </Box>
    </>
  )
}

function BackLink({ heading }: { heading: string }) {
  return (
    <Link to={routePaths.home}>
      <Flex alignItems="center">
        <IoArrowBack />
        <Heading size="xl" ml={8}>
          {heading}
        </Heading>
      </Flex>
    </Link>
  )
}
