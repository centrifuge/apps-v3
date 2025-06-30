import { Button } from '@centrifuge/ui'
import { Container, Flex, Heading } from '@chakra-ui/react'
import PoolManagers from '@components/settings/PoolManagers'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export const SaveChangesButton = () => {
  return <Button label="Save changes" size="sm" width={140} />
}

export default function PoolAccess() {
  return (
    <Container mt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Pool acccess</Heading>
        <SaveChangesButton />
      </Flex>
      <PoolManagers />
    </Container>
  )
}
