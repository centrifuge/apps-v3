import { Stack, Text, VStack } from '@chakra-ui/react'
import { truncateAddress, useAddress, usePoolsByManager } from '@centrifuge/shared'
import { PoolOverviewTable } from '@components/tokenizations/PoolOverviewTable'
import { Loader } from '@centrifuge/ui'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export default function Tokenizations() {
  const { address } = useAddress()
  const { data: allPools, isLoading } = usePoolsByManager(address)
  const poolIds = allPools?.map((p) => p.id).filter((id) => !!id) ?? []

  if (isLoading) return <Loader />

  if (!allPools?.length) {
    if (!address)
      return (
        <VStack>
          <Text>Connect your wallet to view your pools</Text>
        </VStack>
      )
    return <Text>No pools found for {truncateAddress(address)}</Text>
  }
  return <PoolOverviewTable poolIds={poolIds} />
}
