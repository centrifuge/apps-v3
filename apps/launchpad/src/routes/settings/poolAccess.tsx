import { useState, useEffect } from 'react'
import { Button } from '@centrifuge/ui'
import { Container, Flex, Heading } from '@chakra-ui/react'
import PoolManagers from '@components/settings/PoolManagers'
import { useParams } from 'react-router'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export const SaveChangesButton = ({
  currentHubManagers,
  initialHubManagers,
  currentSpokeManagers,
  initialSpokeManagers,
}: {
  currentHubManagers: string[]
  initialHubManagers: string[]
  currentSpokeManagers: { address: string; chainId: number }[]
  initialSpokeManagers: { address: string; chainId: number }[]
}) => {
  const buildHubPayload = () => {
    const addedOrKept = currentHubManagers.map((address) => ({ address, canManage: true }))

    const removed = initialHubManagers
      .filter((address) => !currentHubManagers.includes(address))
      .map((address) => ({ address, canManage: false }))

    return [...addedOrKept, ...removed]
  }

  const buildSpokePayload = () => {
    const addedOrKept = currentSpokeManagers.map((manager) => ({ ...manager, canManage: true }))

    const removed = initialSpokeManagers
      .filter(
        (initialManager) =>
          !currentSpokeManagers.some(
            (currentManager) =>
              currentManager.address === initialManager.address && currentManager.chainId === initialManager.chainId
          )
      )
      .map((manager) => ({ ...manager, canManage: false }))

    return [...addedOrKept, ...removed]
  }

  const hubPayload = buildHubPayload()
  const spokePayload = buildSpokePayload()

  return <Button label="Save changes" size="sm" width={140} />
}

export default function PoolAccess() {
  const { poolId } = useParams()
  const [initialHubManagers, setInitialHubManagers] = useState<string[]>([])
  const [currentHubManagers, setCurrentHubManagers] = useState<string[]>([])
  const [initialSpokeManagers, setInitialSpokeManagers] = useState<{ address: string; chainId: number }[]>([])
  const [currentSpokeManagers, setCurrentSpokeManagers] = useState<{ address: string; chainId: number }[]>([])

  useEffect(() => {
    // TODO: call SDK to get initial hub and spoke managers
    setInitialHubManagers(['0x423420Ae467df6e90291fd0252c0A8a637C1e03f'])
    setInitialSpokeManagers([{ address: '0x423420Ae467df6e90291fd0252c0A8a637C1e03f', chainId: 1 }])

    // TODO: refactor this after initial values are set from SDK
    setCurrentHubManagers(['0x423420Ae467df6e90291fd0252c0A8a637C1e03f'])
    setCurrentSpokeManagers([{ address: '0x423420Ae467df6e90291fd0252c0A8a637C1e03f', chainId: 1 }])
  }, [])

  const addHubManager = (address: string) => {
    if (!address.trim()) return
    if (currentHubManagers.includes(address)) return

    setCurrentHubManagers((prev) => [...prev, address])
  }

  const removeHubManager = (address: string) => {
    setCurrentHubManagers((prev) => prev.filter((m) => m !== address))
  }

  // need to add chainId here as well...
  const addSpokeManager = ({ address, chainId }: { address: string; chainId: number }) => {
    if (!address.trim()) return
    if (currentSpokeManagers.some((currentSpokeManager) => currentSpokeManager.address === address)) return
    setCurrentSpokeManagers((prev) => [...prev, { address, chainId }])
  }

  const removeSpokeManager = (address: string) => {
    setCurrentSpokeManagers((prev) => prev.filter((m) => m.address !== address))
  }

  return (
    <Container mt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Pool acccess</Heading>
        <SaveChangesButton
          currentHubManagers={currentHubManagers}
          currentSpokeManagers={currentSpokeManagers}
          initialHubManagers={initialHubManagers}
          initialSpokeManagers={initialSpokeManagers}
        />
      </Flex>
      <PoolManagers
        currentHubManagers={currentHubManagers}
        currentSpokeManagers={currentSpokeManagers}
        addHubManager={addHubManager}
        removeHubManager={removeHubManager}
        addSpokeManager={addSpokeManager}
        removeSpokeManager={removeSpokeManager}
        poolId={poolId}
      />
    </Container>
  )
}
