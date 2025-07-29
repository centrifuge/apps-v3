import { Text, VStack } from '@chakra-ui/react'
import { useAddress, usePools } from '@centrifuge/shared'
import { PoolOverviewTable } from '@components/tokenizations/PoolOverviewTable'
import { Loader } from '@centrifuge/ui'

export default function Tokenizations() {
  const { address } = useAddress()
  const { data: allPools, isLoading } = usePools()
  const poolIds = allPools?.map((p) => p.id).filter((id) => !!id) ?? []

  if (isLoading) return <Loader />

  if (!allPools?.length) {
    if (!address)
      return (
        <VStack>
          <Text>Connect your wallet to view your pools</Text>
        </VStack>
      )
    return (
      <VStack>
        <Text>No pools found</Text>
      </VStack>
    )
  }
  return <PoolOverviewTable poolIds={poolIds} />
}
