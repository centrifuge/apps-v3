import { Button, NetworkIcon } from '@centrifuge/ui'
import {
  Alert,
  Box,
  Checkbox,
  CheckboxIndicator,
  Container,
  createListCollection,
  Field,
  Flex,
  Grid,
  Heading,
  Input,
  Portal,
  Select,
  Stack,
  Text,
  Button as ChakraButton,
} from '@chakra-ui/react'
import { Card } from '@centrifuge/ui'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useState } from 'react'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export const SaveChangesButton = () => {
  return <Button label="Save changes" size="sm" width={140} />
}

export default function PoolStructure() {
  const { pool, poolDetails } = usePoolProvider()
  const [tokens, setTokens] = useState([
    {
      apy: 'Target',
      apyPercentage: 4.086,
      minInvestment: '1000',
      tokenName: 'Centrifuge',
      symbolName: 'CFG',
    },
    {
      apy: 'Automatic',
      apyPercentage: null,
      minInvestment: '1000',
      tokenName: "Great Onno's Awesome Token",
      symbolName: 'GOAT',
    },
  ])

  console.log({ pool, poolDetails })

  // TODO: Pull all the data from pool, poolDetails, hub details (chains)
  const types = createListCollection({
    items: [
      { label: 'Permissioned', value: 'permissioned' },
      { label: 'Permissionless (coming soon)', value: 'permissionless' },
    ],
  })

  const hubChains = createListCollection({
    items: [
      { label: 'Centrifuge', value: 11155111 },
      { label: 'Etherium', value: 1 },
      { label: 'Celo', value: 42220 },
      { label: 'Arbitrum One', value: 42161 },
      { label: 'Avalanche (coming soon)', value: -1 },
      { label: 'Polygon (coming soon)', value: -1 },
    ],
  })

  const poolDenominations = createListCollection({
    items: [
      { label: 'USDC', value: 'usdc' },
      { label: 'USDT (coming soon)', value: 'usdt' },
      { label: 'DAI (coming soon)', value: 'dai' },
    ],
  })

  const apyTypes = createListCollection({
    items: [
      { label: 'Target', value: 'Target' },
      { label: '7 Day', value: '7day' },
      { label: '30 Day', value: '30day' },
      { label: '90 Day', value: '90day' },
      { label: 'Year to date', value: 'ytd' },
      { label: 'Since inception', value: 'sinceInception' },
      { label: 'Automatic', value: 'Automatic' },
    ],
  })

  const appendToken = () => {
    setTokens((prev) => [
      ...prev,
      {
        apy: '',
        apyPercentage: null,
        minInvestment: '0',
        tokenName: '',
        symbolName: '',
      },
    ])
  }

  return (
    <Container mt={8}>
      <Box mt={8} mb={8}>
        <Alert.Root status="warning" backgroundColor={'#FFF8E7'} display={'flex'} justifyContent={'center'}>
          <Alert.Indicator />
          <Alert.Title>
            These settings apply to the entire pool (i.e., all tokens). Any changes made to this token will also affect
            the others.
          </Alert.Title>
        </Alert.Root>
      </Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">Pool structure</Heading>
        <SaveChangesButton />
      </Flex>
      <Box mt={8}>
        <Text fontSize="sm">Tokenization model</Text>
        <Card mt={4}>
          <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
            <Stack>
              <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                <Select.Root size={'md'} collection={types}>
                  <Select.HiddenSelect />
                  <Select.Label>Type*</Select.Label>
                  <Select.Control style={{ background: '#F6F6F6' }}>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Please select..." />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {types.items.map((type) => (
                          <Select.Item
                            item={type}
                            key={type.value}
                            style={
                              type.value === 'permissionless'
                                ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }
                                : {}
                            }
                          >
                            {type.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Flex>
            </Stack>

            <Stack>
              <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                <Select.Root multiple size={'md'} collection={hubChains}>
                  <Select.HiddenSelect />
                  <Select.Label>Hub chain*</Select.Label>
                  <Select.Control style={{ background: '#F6F6F6' }}>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Please select..." />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {hubChains.items.map((type) => (
                          <Select.Item
                            item={type}
                            key={type.value}
                            style={
                              type.value === -1 ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' } : {}
                            }
                          >
                            <Select.ItemIndicator>
                              <Checkbox.Root size="sm" checked={true}>
                                <Checkbox.Control>
                                  <CheckboxIndicator />
                                </Checkbox.Control>
                              </Checkbox.Root>
                            </Select.ItemIndicator>
                            <NetworkIcon networkId={type.value} />
                            {type.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Flex>
            </Stack>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
            <Stack>
              <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                <Select.Root size={'md'} collection={poolDenominations}>
                  <Select.HiddenSelect />
                  <Select.Label>Pool denomination</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Please select..." />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {poolDenominations.items.map((currency) => (
                          <Select.Item
                            item={currency}
                            key={currency.value}
                            style={
                              currency.value === 'usdt' || currency.value === 'dai'
                                ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }
                                : {}
                            }
                          >
                            {currency.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Flex>
            </Stack>
          </Grid>
        </Card>

        <Text fontSize="sm" mt={8}>
          Tokens
        </Text>
        {tokens.map((token, index) => (
          <Card mt={4}>
            <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
              <Stack>
                <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                  <Field.Root>
                    <Field.Label>Token name</Field.Label>
                    <Input placeholder="Type here..." value={token.tokenName} style={{ background: '#F6F6F6' }} />
                  </Field.Root>
                </Flex>
              </Stack>

              <Stack>
                <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                  <Field.Root>
                    <Field.Label>Token symbol (4-12 characters)*</Field.Label>
                    <Input placeholder="Type here..." value={token.symbolName} style={{ background: '#F6F6F6' }} />
                  </Field.Root>
                </Flex>
              </Stack>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
              <Stack>
                <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                  <Field.Root>
                    <Field.Label>Min Investment*</Field.Label>
                    <Input placeholder="Type here..." value={token.minInvestment} style={{ background: '#F6F6F6' }} />
                  </Field.Root>
                </Flex>
              </Stack>

              <Stack>
                <Flex alignItems="center" gap={2} borderRadius="md" p={1}>
                  <Select.Root
                    size={'md'}
                    collection={apyTypes}
                    value={[token.apy]}
                    borderRadius={10}
                    borderTopRightRadius={0}
                    borderBottomRightRadius={0}
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Apy</Select.Label>
                    <Select.Control style={{ background: '#F6F6F6' }}>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Please select..." />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {apyTypes.items.map((apyType) => (
                            <Select.Item item={apyType} key={apyType.value} justifyContent="flex-start">
                              {apyType.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>

                  {token.apy !== 'Automatic' && (
                    <Field.Root mt={6}>
                      <Input
                        placeholder="Type here..."
                        value={String(token.apyPercentage)}
                        style={{ background: '#F6F6F6' }}
                      />
                    </Field.Root>
                  )}
                </Flex>
              </Stack>
            </Grid>
            {tokens.length - 1 === index && (
              <Grid templateColumns="1fr 4fr" gap={4} mt={8}>
                <ChakraButton onClick={appendToken}>Add another token</ChakraButton>
              </Grid>
            )}
          </Card>
        ))}
      </Box>
      <Box mt={8} mb={8}>
        <Flex justifyContent="center" alignItems="center">
          <SaveChangesButton />
        </Flex>
      </Box>
    </Container>
  )
}
