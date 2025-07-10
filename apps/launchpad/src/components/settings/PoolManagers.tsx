import { Box, Text } from '@chakra-ui/react'
import HubManagers from './HubManagers'
import SpokeManagers from './SpokeManagers'

type PoolManagersProps = {
  currentHubManagers: `0x${string}`[]
  currentSpokeManagers: { address: `0x${string}`; chainId: number }[]
  poolId: string
  addHubManager: (address: `0x${string}`) => void
  removeHubManager: (address: `0x${string}`) => void
  addSpokeManager: ({ address, chainId }: { address: `0x${string}`; chainId: number }) => void
  removeSpokeManager: (address: `0x${string}`) => void
}

export default function PoolManagers({
  currentHubManagers,
  currentSpokeManagers,
  poolId,
  addHubManager,
  removeHubManager,
  addSpokeManager,
  removeSpokeManager,
}: PoolManagersProps) {
  return (
    <Box mt={8}>
      <Text fontSize="sm">Pool managers *</Text>
      <HubManagers
        currentHubManagers={currentHubManagers}
        addHubManager={addHubManager}
        removeHubManager={removeHubManager}
      />
      <SpokeManagers
        currentSpokeManagers={currentSpokeManagers}
        poolId={poolId}
        addSpokeManager={addSpokeManager}
        removeSpokeManager={removeSpokeManager}
      />
    </Box>
  )
}
