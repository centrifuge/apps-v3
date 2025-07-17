import { Select, SwitchControl } from '@centrifuge/forms'
import { Button } from '@centrifuge/ui'
import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react'

export default function SelectVault() {
  const vaults = true
  return vaults ? (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      <GridItem border="1px solid" borderColor="yellow.500" borderRadius="md" p={4} backgroundColor="yellow.50">
        <Grid gridTemplateColumns="200px 1fr" gap={2}>
          <Heading size="md">Vault 1</Heading>
          <Box justifySelf="flex-end">
            <SwitchControl name="enabled" label="Enabled" />
          </Box>
          <Text>Share class</Text>
          <Text textAlign="right">JTRS</Text>
          <Text>Type of vault</Text>
          <Text textAlign="right">Sync</Text>
          <Text>Address of the vault</Text>
          <Text textAlign="right">0x12345678901234567</Text>
          <Text>Hook</Text>
          <Text textAlign="right">0x1234567890123456</Text>
        </Grid>
      </GridItem>
    </Grid>
  ) : (
    <Grid gridTemplateColumns="1fr 1fr" gap={4}>
      <Select name="vaultType" label="Type of vault" items={[]} />
      <Select name="vaultType" label="Type of vault" items={[]} />
      <Button label="Add another" maxWidth="30%" size="sm" colorPalette="black" />
    </Grid>
  )
}
