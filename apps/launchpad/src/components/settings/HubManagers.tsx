import { AddressInput, Card, NetworkIcon } from '@centrifuge/ui'
import { Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { infoText } from '@utils/infoText'

type HubManagersProps = {
  currentHubManagers: `0x${string}`[]
  addHubManager: (address: `0x${string}`) => void
  removeHubManager: (address: `0x${string}`) => void
}

export default function HubManagers({ currentHubManagers, addHubManager, removeHubManager }: HubManagersProps) {
  return (
    <>
      <Card mt={4}>
        <Stack>
          <Heading size="md">Hub manager</Heading>
          <Text fontSize="xs" color="text-secondary">
            {infoText.poolManagers}
          </Text>
        </Stack>
        <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
          <AddressInput
            onAdd={addHubManager}
            onDelete={removeHubManager}
            addresses={currentHubManagers.map((chm) => ({ address: chm }))}
          />
          <Stack>
            <Heading size="sm">Hub chain*</Heading>
            <Flex alignItems="center" gap={2} border="1px solid" borderColor="border-primary" borderRadius="md" p={1}>
              <NetworkIcon />
              <Text>Ethereum</Text>
            </Flex>
          </Stack>
        </Grid>
      </Card>
    </>
  )
}
