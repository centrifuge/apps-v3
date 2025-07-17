import { useState, useEffect } from 'react'
import { Button } from '@centrifuge/ui'
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useAddress, useCentrifugeTransaction, useIsPoolManager } from '@centrifuge/shared'
import { HexString } from '@centrifuge/sdk'
import HubManagers from '@components/settings/HubManagers'
import SpokeManagers from '@components/settings/SpokeManagers'
import { usePoolProvider } from '@contexts/PoolProvider'

export const SaveChangesButton = ({ onSubmit, isDisabled }: { onSubmit: () => void; isDisabled: boolean }) => {
  return <Button disabled={isDisabled} onClick={onSubmit} label="Save changes" size="sm" width={140} />
}

export default function PoolAccess() {
  const { pool } = usePoolProvider()

  // TODO:
  // Set initial values from SDK when functions are available
  const [initialHubManagers] = useState<HexString[]>([])
  const [currentHubManagers, setCurrentHubManagers] = useState<HexString[]>([])
  const [initialSpokeManagers] = useState<{ address: HexString; chainId: number }[]>([])
  const [currentSpokeManagers, setCurrentSpokeManagers] = useState<{ address: HexString; chainId: number }[]>([])
  const { execute } = useCentrifugeTransaction()
  const [isDisabled, setIsDisabled] = useState(true)
  const { address } = useAddress()
  const isPoolManager = useIsPoolManager(pool?.id, address)

  useEffect(() => {
    const hubManagers = buildHubPayload()
    const spokeManagers = buildSpokePayload()

    if (hubManagers.length !== 0 || spokeManagers.length !== 0) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [currentHubManagers, currentSpokeManagers])

  if (!pool) return null

  // TODO: Check if address is not already a hub manager (wait for SDK part first)
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

  // TODO: Check if address is not already a spoke manager (wait for SDK part first)
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

  function buildHubPayload() {
    const removed = initialHubManagers
      .filter((address) => !currentHubManagers.includes(address))
      .map((address) => ({ address, canManage: false }))

    const added = currentHubManagers
      .filter((address) => !initialHubManagers.includes(address))
      .map((address) => ({ address, canManage: true }))

    return [...added, ...removed]
  }

  function buildSpokePayload() {
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
      await execute(pool.updatePoolManagers(hubPayload))
    }

    if (spokePayload.length !== 0) {
      await execute(pool.updateBalanceSheetManagers(spokePayload))
    }
  }

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Pool acccess</Heading>
        <SaveChangesButton isDisabled={isDisabled || !isPoolManager} onSubmit={handleSubmit} />
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
          addSpokeManager={addSpokeManager}
          removeSpokeManager={removeSpokeManager}
        />
      </Box>
    </Container>
  )
}
