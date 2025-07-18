import { Button, NetworkIcon, Card } from '@centrifuge/ui'
import { Alert, Box, Container, Flex, Grid, Heading, Stack, Text, Button as ChakraButton } from '@chakra-ui/react'
import { Form, useForm, Select, MultiSelect, Input } from '@centrifuge/forms'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useFieldArray } from 'react-hook-form'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export const SaveChangesButton = () => {
  return <Button type="submit" label="Save changes" size="sm" width={140} />
}

export default function PoolStructure() {
  const { pool, poolDetails } = usePoolProvider()
  const [tokens, setTokens] = useState([
    {
      apy: 'Target',
      apyPercentage: '4.086',
      minInvestment: '1000',
      tokenName: 'Centrifuge',
      symbolName: 'CFGG',
    },
    {
      apy: 'Automatic',
      apyPercentage: null,
      minInvestment: '1000',
      tokenName: "Great Onno's Awesome Token",
      symbolName: 'GOAT',
    },
  ])

  //   console.log({ pool, poolDetails })

  // TODO: Pull all the data from pool, poolDetails, hub details (chains)
  const poolTypes = [
    { label: 'Permissioned', value: 'open' },
    {
      label: 'Permissionless (coming soon)',
      value: 'closed',
      disabled: true,
    },
  ]

  const poolDenominations = [
    { label: 'USDC', value: 'usdc' }, // 6 decimal
    { label: 'USDT (coming soon)', value: 'usdt', disabled: true },
    { label: 'DAI (coming soon)', value: 'dai', disabled: true },
  ]

  const hubChains = [
    {
      label: 'Centrifuge',
      value: '11155111',
      children: (
        <Text style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NetworkIcon networkId={11155111} />
          Centrifuge
        </Text>
      ),
    },
    {
      label: 'Etherium',
      value: '1',
      children: (
        <Text style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NetworkIcon networkId={1} />
          Etherium
        </Text>
      ),
    },
    {
      label: 'Celo',
      value: '42220',
      children: (
        <Text style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NetworkIcon networkId={42220} />
          Celo
        </Text>
      ),
    },
    {
      label: 'Arbitrum One',
      value: '42161',
      children: (
        <Text style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NetworkIcon networkId={42161} />
          Arbitrum One
        </Text>
      ),
    },
    {
      label: 'Avalanche (coming soon)',
      value: '-1',
      disabled: true,
      children: (
        <Text style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NetworkIcon networkId={1} />
          Avalanche (coming soon)
        </Text>
      ),
    },
    {
      label: 'Polygon (coming soon)',
      value: '-2',
      disabled: true,
      children: (
        <Text style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NetworkIcon networkId={1} />
          Polygon (coming soon)
        </Text>
      ),
    },
  ]

  const apy = [
    { label: 'Target', value: 'Target' },
    { label: '7 Day', value: '7day' },
    { label: '30 Day', value: '30day' },
    { label: '90 Day', value: '90day' },
    { label: 'Year to date', value: 'ytd' },
    { label: 'Since inception', value: 'sinceInception' },
    { label: 'Automatic', value: 'Automatic' },
  ]

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

  const schema = z.object({
    poolType: z.string().min(1, 'Pool type is required'),
    hubChains: z.array(z.string().min(1, 'At least one hub chain is required')),
    poolDenomination: z.string().optional(),
    tokens: z.array(
      z.object({
        tokenName: z.string().optional(),
        symbolName: z.string().min(4, 'Symbol name is required').max(12, 'Symbol name must be less than 12 characters'),
        minInvestment: z.string().refine((val) => Number(val) > 0, {
          message: 'Min investment must be numeric and greater than 0',
        }),
        apy: z.string().optional(),
        apyPercentage: z.string().optional().nullable(),
        // apyPercentage: z
        //   .string()
        //   .optional()
        //   .nullable()
        //   .refine(
        //     (val) => {
        //       console.log({ val })
        //       if (val !== null || val !== undefined) {
        //         const num = parseFloat(val)
        //         return !isNaN(num) && num > 0
        //       }
        //     },
        //     {
        //       message: 'Min investment must be numeric and greater than 0',
        //     }
        //   ),
      })
    ),
  })

  const form = useForm({
    schema,
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Form submitted with values:', values)
    },
    onSubmitError: (error) => console.error('Pool Structure form submission error:', error),
  })

  const { control, watch } = form

  // useFieldArray to manage the 'tokens' array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tokens',
  })

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
      <Form form={form} style={{ height: '100%' }}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">Pool structure</Heading>
          <SaveChangesButton />
        </Flex>
        <Box mt={8}>
          <Text fontSize="sm">Tokenization model</Text>
          <Card mt={4}>
            <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
              <Stack>
                <Select name={'poolType'} items={poolTypes} label={'Type*'} style={{ background: '#F6F6F6' }} />
              </Stack>

              <Stack>
                <MultiSelect
                  name={'hubChains'}
                  items={hubChains}
                  label={'Hub chains*'}
                  style={{ background: '#F6F6F6' }}
                />
              </Stack>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
              <Stack>
                <Select name={'poolDenomination'} items={poolDenominations} label={'Pool denomination'} />
              </Stack>
            </Grid>
          </Card>

          <Text fontSize="sm" mt={8}>
            Tokens
          </Text>
          {fields.map((field, index) => (
            <Card mt={4}>
              <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
                <Stack>
                  <Input
                    name={`tokens.${index}.tokenName`}
                    placeholder="Type here..."
                    style={{ background: '#F6F6F6' }}
                    label="Token name"
                  />
                </Stack>

                <Stack>
                  <Input
                    placeholder="Type here..."
                    style={{ background: '#F6F6F6' }}
                    name={'symbolName'}
                    label="Token symbol (4-12 characters)*"
                  />
                </Stack>
              </Grid>

              <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
                <Stack>
                  <Input
                    placeholder="Type here..."
                    style={{ background: '#F6F6F6' }}
                    name={'minInvestment'}
                    label="Min investment*"
                  />
                </Stack>

                <Stack>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <Select name={'apy'} items={apy} label={'Apy'} style={{ background: '#F6F6F6' }} />

                    {token.apy !== 'Automatic' && (
                      <Input
                        placeholder="Type here..."
                        style={{ background: '#F6F6F6' }}
                        name={'apyPercentage'}
                        mt={6}
                      />
                    )}
                  </Grid>
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
      </Form>
    </Container>
  )
}
