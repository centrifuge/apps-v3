import { SegmentGroup } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { useAllPoolDetails } from '../hooks/usePools'
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
      onValueChange={(e) => {
        const selectedPool = displayPools.find((pool) => pool.label === e.value)
        if (selectedPool) {
          setSelectedPoolId(new PoolId(selectedPool.value))
        }
      }}
      bg="backgroundTertiary"
      padding={2}
      borderRadius="10px"
    >
      <SegmentGroup.Indicator bg="textInverted" />
      <SegmentGroup.Items w="full" borderRadius="10px" border="none" items={displayPools?.map((pool) => pool.label)} />
    </SegmentGroup.Root>
  )
}
