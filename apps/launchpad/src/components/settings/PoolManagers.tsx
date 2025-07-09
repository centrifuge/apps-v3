import { Box, Text } from '@chakra-ui/react'
import HubManagers from './HubManagers'
import SpokeManagers from './SpokeManagers'

type PoolManagersProps = {
  currentHubManagers: string[]
  currentSpokeManagers: { address: string; chainId: number }[]
  addHubManager: (address: string) => void
  removeHubManager: (address: string) => void
  addSpokeManager: ({ address, chainId }: { address: string; chainId: number }) => void
  removeSpokeManager: (address: string) => void
}

export default function PoolManagers({
  currentHubManagers,
  currentSpokeManagers,
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
        addSpokeManager={addSpokeManager}
        removeSpokeManager={removeSpokeManager}
      />
    </Box>
  )
}
