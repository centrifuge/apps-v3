import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PoolId } from '@centrifuge/sdk'
import { ipfsToHttp, PoolDetails, useAllPoolDetails } from '@centrifuge/shared'
import { Card, ValueText } from '@centrifuge/ui'
import { routePaths } from '@routes/routePaths'
import { Flex, Grid, Separator, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { HomePageSkeleton } from '@components/Skeletons/HomePageSkeleton'

interface PoolSelectorProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export const PoolCardsSelect = ({ poolIds, setSelectedPoolId }: PoolSelectorProps) => {
  const { data: pools, isLoading } = useAllPoolDetails(poolIds)

  const displayPools = useMemo(
    () =>
      pools?.map((pool) => ({
        id: pool.id.toString(),
        setId: () => setSelectedPoolId(pool.id),
        pool,
      })),
    [pools]
  )

  console.log({ pools })

  if (isLoading) return <HomePageSkeleton />

  if (!displayPools || pools?.length === 1) return null

  return (
    <>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
        {displayPools.map((pool) => (
          <Link to={`${routePaths.poolPage}/${pool.id}`} onClick={pool.setId} key={pool.id}>
            <PoolCard poolDetails={pool.pool} />
          </Link>
        ))}
      </Grid>
    </>
  )
}

function PoolCard({ poolDetails }: { poolDetails: PoolDetails }) {
  const tvl = '450,000,000'
  const poolMetadata = poolDetails.metadata?.pool
  const iconUri = poolMetadata?.icon?.uri
  const shareClassId = Object.keys(poolDetails.metadata?.shareClasses ?? {})[0]
  const shareClassDetails = poolDetails.metadata?.shareClasses[shareClassId] ?? {}

  return (
    <Card height="100%">
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="sm">{poolMetadata?.name}</Text>
        <Image src={ipfsToHttp(iconUri ?? '')} alt={poolMetadata?.name} height="36px" width="36px" />
      </Flex>
      <Separator my={4} />
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <ValueText label="TVL(USDC)" value={tvl} />
        <ValueText label="APY" value={shareClassDetails?.apyPercentage ?? '0%'} />
      </Grid>
      <Separator my={4} />
      <Text color="gray.400">{poolMetadata?.description ?? 'Description'}</Text>
      <Separator my={4} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xs" fontWeight={500}>
          Asset type
        </Text>
        <Text fontSize="xs" fontWeight={500}>
          {poolMetadata?.asset.subClass}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xs" fontWeight={500}>
          Investor type
        </Text>
        <Text fontSize="xs" fontWeight={500}>
          {poolMetadata?.investorType}
        </Text>
      </Flex>
    </Card>
  )
}
