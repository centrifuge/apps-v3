import { Button, Card } from '@centrifuge/ui'
import { Container, Grid, Heading, Box } from '@chakra-ui/react'
import { Section } from './Section'
import { usePoolProvider } from '@contexts/PoolProvider'

export default function Approve() {
  const { isLoading } = usePoolProvider()

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container mt={8}>
      <Grid templateColumns="1fr 160px" gap={4}>
        <Heading>Approve investments</Heading>
        <Button label="Approve" onClick={() => {}} />
        <Box gridColumn="1 / -1" mt={4}>
          <Card>
            <Section sections={sections} />
          </Card>
        </Box>
      </Grid>
    </Container>
  )
}
