import { useAddress, useAllPoolDetails, useCentrifugeTransaction, usePools } from '@centrifuge/shared'
import { Button, Modal } from '@centrifuge/ui'
import { Flex, Grid, Heading, Text, VStack } from '@chakra-ui/react'
import { WhitelistInvestor } from '@components/investors/WhitelistInvestor'
import { useMemo, useState } from 'react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

export default function Investors() {
  const { poolId } = useSelectedPool()
  const [isOpen, setIsOpen] = useState(false)

  if (!poolId) return <Text>No pool selected</Text>

  return (
    <>
      <Grid templateColumns={['1fr', '1fr 1fr']} justifyContent="space-between" alignItems="center">
        <Heading size="md">Investors</Heading>
        <Flex gap={2} justifyContent="flex-end">
          <Button label="Onboarding settings" colorPalette="gray" />
          <Button label="Add new investor" colorPalette="black" onClick={() => setIsOpen(true)} />
        </Flex>
      </Grid>
      <VStack
        mt={4}
        backgroundColor="white"
        borderRadius="md"
        p={4}
        border="1px solid"
        borderColor="gray.200"
        h="400px"
        alignItems="center"
        justifyContent="center"
      >
        Investors table coming soon
      </VStack>
      <WhitelistInvestor isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
