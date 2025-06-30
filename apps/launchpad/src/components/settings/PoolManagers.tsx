import { AddressInput, Card, NetworkIcon, Tooltip } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { infoText } from '@utils/infoText'

export default function PoolManagers() {
  return (
    <Box mt={8}>
      <Text fontSize="sm">Pool managers *</Text>
      <Card mt={4}>
        <Stack>
          <Heading size="md">Hub manager</Heading>
          <Text fontSize="xs" color="text-secondary">
            {infoText.poolManagers}
          </Text>
        </Stack>
        <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
          <AddressInput onClick={() => {}} addresses={['0x423420Ae467df6e90291fd0252c0A8a637C1e03f']} />
          <Stack>
            <Heading size="sm">Hub chain*</Heading>
            <Flex alignItems="center" gap={2} border="1px solid" borderColor="border-primary" borderRadius="md" p={2}>
              <NetworkIcon />
              <Text>Ethereum</Text>
            </Flex>
          </Stack>
        </Grid>
      </Card>
    </Box>
  )
}
