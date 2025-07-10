import { useState, useMemo } from 'react'
import { Button } from '@centrifuge/ui'
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useParams } from 'react-router'
import { useCentrifugeTransaction, usePool } from '@centrifuge/shared'
import { HexString, PoolId } from '@centrifuge/sdk'
import HubManagers from '@components/settings/HubManagers'
import SpokeManagers from '@components/settings/SpokeManagers'

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

  const [initialHubManagers] = useState<HexString[]>(['0x423420ae467df6e90291fd0252c0a8a637c1e03f'])
  const [currentHubManagers, setCurrentHubManagers] = useState<HexString[]>([
    '0x423420ae467df6e90291fd0252c0a8a637c1e03f',
  ])
  const [initialSpokeManagers] = useState<{ address: HexString; chainId: number }[]>([
    { address: '0x423420ae467df6e90291fd0252c0a8a637c1e03f', chainId: 1 },
  ])
  const [currentSpokeManagers, setCurrentSpokeManagers] = useState<{ address: HexString; chainId: number }[]>([
    { address: '0x423420ae467df6e90291fd0252c0a8a637c1e03f', chainId: 1 },
  ])
  const { execute } = useCentrifugeTransaction()

  // TODO:
  // Set initial values from SDK when functions are available

  const addHubManager = (address: HexString) => {
    if (!address.trim()) return
    const validAddress = address.toLowerCase() as HexString
    if (currentHubManagers.includes(validAddress)) return

    setCurrentHubManagers((prev) => [...prev, validAddress])
  }

  const removeHubManager = ({ address }: { address: HexString }) => {
    const validAddress = address.toLowerCase() as HexString
    setCurrentHubManagers((prev) => prev.filter((m) => m !== validAddress))
  }

  const addSpokeManager = ({ address, chainId }: { address: HexString; chainId: number }) => {
    if (!address.trim()) return
    const validAddress = address.toLowerCase() as HexString
    if (
      currentSpokeManagers.some(
        (currentSpokeManager) => currentSpokeManager.address === validAddress && currentSpokeManager.chainId === chainId
      )
    ) {
      return
    }
    setCurrentSpokeManagers((prev) => [...prev, { address: validAddress, chainId }])
  }

  const removeSpokeManager = ({ address, chainId }: { address: HexString; chainId: number }) => {
    const validAddress = address.toLowerCase() as HexString
    setCurrentSpokeManagers((prev) => prev.filter((m) => m.address !== validAddress && m.chainId !== chainId))
  }

  const buildHubPayload = () => {
    const removed = initialHubManagers
      .filter((address) => !currentHubManagers.includes(address))
      .map((address) => ({ address, canManage: false }))

    const added = currentHubManagers
      .filter((address) => !initialHubManagers.includes(address))
      .map((address) => ({ address, canManage: true }))

    return [...added, ...removed]
  }

  const buildSpokePayload = () => {
    const removed = initialSpokeManagers
      .filter(
        (initialManager) =>
          !currentSpokeManagers.some(
            (currentManager) =>
              currentManager.address === initialManager.address && currentManager.chainId === initialManager.chainId
          )
      )
      .map((manager) => ({ ...manager, canManage: false }))

    const added = currentSpokeManagers
      .filter(
        (initialManager) =>
          !initialSpokeManagers.some(
            (currentManager) =>
              currentManager.address === initialManager.address && currentManager.chainId === initialManager.chainId
          )
      )
      .map((manager) => ({ ...manager, canManage: true }))

    return [...added, ...removed]
  }

  const handleSubmit = async () => {
    const hubPayload = buildHubPayload()
    const spokePayload = buildSpokePayload()

    if (!pool) return

    if (hubPayload.length !== 0) {
      const hubResult = await execute(pool.updatePoolManagers(hubPayload))
      console.log({ hubResult })
    }

    if (spokePayload.length !== 0) {
      const spokeResult = await execute(pool.updateBalanceSheetManagers(spokePayload))
      console.log({ spokeResult })
    }
  }

  return (
    <Container mt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Pool acccess</Heading>
        <SaveChangesButton onSubmit={handleSubmit} />
      </Flex>
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
    </Container>
  )
}
