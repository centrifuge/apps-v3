import { useState, useEffect, useMemo } from 'react'
import { Button } from '@centrifuge/ui'
import { Container, Flex, Heading } from '@chakra-ui/react'
import PoolManagers from '@components/settings/PoolManagers'
import { useParams } from 'react-router'
import { useCentrifugeTransaction, usePool } from '@centrifuge/shared'
import { PoolId } from '@centrifuge/sdk'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export const SaveChangesButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return <Button onClick={onSubmit} label="Save changes" size="sm" width={140} />
}

export default function PoolAccess() {
  const { poolId } = useParams()

  if (!poolId) return null

  const memoizedPoolId = useMemo(() => {
    return poolId ? new PoolId(poolId) : undefined
  }, [poolId])

  const { data: pool } = usePool(memoizedPoolId)

  const [initialHubManagers, setInitialHubManagers] = useState<`0x${string}`[]>([])
  const [currentHubManagers, setCurrentHubManagers] = useState<`0x${string}`[]>([])
  const [initialSpokeManagers, setInitialSpokeManagers] = useState<{ address: `0x${string}`; chainId: number }[]>([])
  const [currentSpokeManagers, setCurrentSpokeManagers] = useState<{ address: `0x${string}`; chainId: number }[]>([])
  const { execute } = useCentrifugeTransaction()

  useEffect(() => {
    // TODO: call SDK to get initial hub and spoke managers
    setInitialHubManagers(['0x423420Ae467df6e90291fd0252c0A8a637C1e03f'])
    setInitialSpokeManagers([{ address: '0x423420Ae467df6e90291fd0252c0A8a637C1e03f', chainId: 1 }])

    // TODO: refactor this after initial values are set from SDK
    setCurrentHubManagers(['0x423420Ae467df6e90291fd0252c0A8a637C1e03f'])
    setCurrentSpokeManagers([{ address: '0x423420Ae467df6e90291fd0252c0A8a637C1e03f', chainId: 1 }])
  }, [])

  const addHubManager = (address: `0x${string}`) => {
    if (!address.trim()) return
    if (currentHubManagers.includes(address)) return

    setCurrentHubManagers((prev) => [...prev, address])
  }

  const removeHubManager = (address: `0x${string}`) => {
    setCurrentHubManagers((prev) => prev.filter((m) => m !== address))
  }

  const addSpokeManager = ({ address, chainId }: { address: `0x${string}`; chainId: number }) => {
    if (!address.trim()) return
    if (currentSpokeManagers.some((currentSpokeManager) => currentSpokeManager.address === address)) return
    setCurrentSpokeManagers((prev) => [...prev, { address, chainId }])
  }

  const removeSpokeManager = (address: `0x${string}`) => {
    setCurrentSpokeManagers((prev) => prev.filter((m) => m.address !== address))
  }

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

  const handleSubmit = () => {
    const hubPayload = buildHubPayload()
    const spokePayload = buildSpokePayload()

    console.log({ hubPayload, spokePayload })

    if (!pool) return

    // execute(pool.updatePoolManagers(hubPayload))
    // execute(pool.updateBalanceSheetManagers(spokePayload))
  }

  return (
    <Container mt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Pool acccess</Heading>
        <SaveChangesButton onSubmit={handleSubmit} />
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
