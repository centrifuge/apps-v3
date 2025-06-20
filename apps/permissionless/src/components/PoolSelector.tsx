import { SegmentGroup } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { useAllPoolDetails } from '@centrifuge/shared'
import { useSelectedPoolContext } from '../contexts/useSelectedPoolContext'

export const PoolSelector = () => {
  const { data: pools } = useAllPoolDetails()
  const { selectedPoolId, setSelectedPoolId } = useSelectedPoolContext()

  const displayPools = pools?.map((pool) => ({
    value: pool.id.toString(),
    label: pool.metadata?.pool?.name || pool.id.toString(),
  }))

  if (pools?.length === 0 || !displayPools || pools?.length === 1) return null

  return (
    <SegmentGroup.Root
      value={displayPools.find((pool) => pool.value === selectedPoolId?.toString())?.label}
      onValueChange={(details: { value: string }) => {
        const selectedPool = displayPools.find((pool) => pool.label === details.value)
        if (selectedPool) {
          setSelectedPoolId(new PoolId(selectedPool.value))
        }
      }}
      bg="bg-tertiary"
      padding={2}
      borderRadius="10px"
    >
      <SegmentGroup.Indicator bg="text-inverted" />
      <SegmentGroup.Items w="full" borderRadius="10px" border="none" items={displayPools?.map((pool) => pool.label)} />
    </SegmentGroup.Root>
  )
}
