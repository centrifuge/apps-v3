import { Button, Card, Flex, Heading } from '@chakra-ui/react'
import { useParams } from 'react-router'

export const handle = {
  title: 'Janus Henderson Anemoy Treasury Fund',
  hasSettings: false,
  hasTabs: false,
}

export default function Nav() {
  const { shareClassId } = useParams()
  console.log({ shareClassId })

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mt={4}>
        <Heading size="lg">Update NAV</Heading>
        <Button colorPalette="yellow" size="sm">
          Save Changes
        </Button>
      </Flex>
      <Card.Root>
        <Card.Body gap="4">
          <p>one</p>
          <p>two</p>
        </Card.Body>
      </Card.Root>
    </>
  )
}
