import { Button, Card, NetworkIcon, Checkbox } from '@centrifuge/ui'
import { Container, Grid, Heading, Box, Stack, Flex } from '@chakra-ui/react'
import { Section } from './Section'
import { usePoolProvider } from '@contexts/PoolProvider'
import { networkToName } from '@centrifuge/shared'

export default function Approve() {
  const { isLoading, vaults } = usePoolProvider()

  // TODO: add correct values when available on sdk
  // should be the sum of all investments for all the vaults
  const sections = [
    {
      title: 'Approve investments',
      value: 0,
      currency: 'USDC',
    },
    {
      title: 'Total investments',
      value: 0,
      currency: 'USDC',
    },
  ]

  console.log(vaults)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container mt={8}>
      <Grid templateColumns="1fr 160px" gap={4}>
        <Heading>Approve investments</Heading>
        <Button label="Approve" onClick={() => {}} size="sm" />
        <Box gridColumn="1 / -1" mt={4}>
          <Card>
            <Section sections={sections} />
          </Card>
        </Box>
      </Grid>
      {vaults?.map((vault: any) => (
        <Box key={vault.chainId} mt={8} mb={8}>
          <Stack>
            <Flex justifyContent="space-between">
              <Flex alignItems="center" gap={2}>
                <NetworkIcon networkId={vault.chainId} />
                <Heading size="md">{networkToName(vault.chainId)} Investments</Heading>
              </Flex>
              <Checkbox />
            </Flex>
            <Card>aaa</Card>
          </Stack>
        </Box>
      ))}
    </Container>
  )
}
