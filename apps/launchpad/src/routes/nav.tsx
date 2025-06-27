import { useParams } from 'react-router'
import z from 'zod'
import { Box, Card, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { createBalanceSchema, Form, safeParse, SubmitButton, useForm } from '@centrifuge/forms'
import { NavForm } from '@components/nav/NavForm'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useMemo } from 'react'
import { formatBalance } from '@centrifuge/shared'

export const handle = {
  hasSettings: false,
  hasTabs: false,
}

const schema = z.object({
  currentNav: createBalanceSchema(2),
  newNav: createBalanceSchema(2),
  currentTokenPrice: createBalanceSchema(2),
  newTokenPrice: createBalanceSchema(2),
})

export default function Nav() {
  const params = useParams()
  const { vaultsDetails } = usePoolProvider()
  console.log({ shareClassId: params.shareClassId, vaultsDetails })

  const form = useForm({
    schema,
    defaultValues: {
      currentNav: '',
      currentTokenPrice: '',
      newNav: '',
      newTokenPrice: '',
    },
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Nav form values: ', values)
    },
    onSubmitError: (error) => console.error('Nav form submission error:', error),
  })

  const { watch } = form
  const [currentTokenPrice, newTokenPrice] = watch(['currentTokenPrice', 'newTokenPrice'])
  const parsedCurrentTokenPrice = useMemo(
    () => safeParse(schema.shape.currentTokenPrice, currentTokenPrice) ?? 0,
    [currentTokenPrice]
  )
  const parsedNewTokenPrice = useMemo(() => safeParse(schema.shape.newTokenPrice, newTokenPrice) ?? 0, [newTokenPrice])

  return (
    <Container maxWidth="6xl">
      <Form form={form} style={{ height: '100%' }}>
        <Flex alignItems="center" justifyContent="space-between" my={8}>
          <Heading size="lg">Update NAV</Heading>
          <SubmitButton colorPalette="yellow" size="sm">
            Save Changes
          </SubmitButton>
        </Flex>
        <Card.Root>
          <Card.Body>
            <NavForm parsedNewTokenPrice={parsedNewTokenPrice} />
            <Box border="1px solid" borderColor="gray.200" backgroundColor="gray.200" borderRadius="sm" p={2}>
              <Text fontSize="xs" textAlign="center">
                {`This action will change the token price from ${formatBalance(parsedCurrentTokenPrice, 'USD', 2)} to ${formatBalance(parsedNewTokenPrice, 'USD', 2)}. Token prices will be propagated to all networks JTRSY is deployed to.`}
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>
      </Form>
    </Container>
  )
}
