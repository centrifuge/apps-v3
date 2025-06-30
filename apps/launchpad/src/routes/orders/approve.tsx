import { Button, Card, NetworkIcon, Checkbox } from '@centrifuge/ui'
import { Container, Grid, Heading, Box, Stack, Flex } from '@chakra-ui/react'
import { BottomSection, HeaderSection } from './Sections'
import { usePoolProvider } from '@contexts/PoolProvider'
import { networkToName } from '@centrifuge/shared'
import { createBalanceSchema, Form, safeParse, useForm } from '@centrifuge/forms'
import z from 'zod'
import { useEffect } from 'react'

const schema = z.object({
  selectedVaults: z.array(z.number()),
})

const vaults = [
  {
    chainId: 11155111,
    id: 1,
  },
]

export const ApproveButton = ({ disabled }: { disabled: boolean }) => {
  return <Button label="Approve" onClick={() => {}} size="sm" width={163} disabled={disabled} />
}

export default function Approve() {
  const isLoading = false
  // const { isLoading, vaults } = usePoolProvider()

  useEffect(() => setValue('selectedVaults', []), [])

  // TODO: add correct values when available on sdk
  // should be the sum of all investments for all the vaults
  const sections = [
    {
      title: 'Approve investments',
      value: 0,
      currency: 'USDC',
      decimals: 2,
    },
    {
      title: 'Total investments',
      value: 0,
      currency: 'USDC',
      decimals: 2,
    },
  ]

  const bottomSections = [
    {
      title: 'Approve investments',
      value: 0,
      currency: 'USDC',
      decimals: 2,
      checkboxLabel: 'Approve and issue',
    },
  ]

  const form = useForm({
    schema,
    defaultValues: {
      selectedVaults: [],
    },
    mode: 'onChange',
    onSubmit: (values) => {
      console.log('Nav form values: ', values)
    },
    onSubmitError: (error) => console.error('Nav form submission error:', error),
  })

  const { watch, setValue } = form
  const selectedVaults = watch('selectedVaults')

  const onCheckedChange = (vaultId: number) => {
    if (selectedVaults.includes(vaultId)) {
      form.setValue(
        'selectedVaults',
        selectedVaults.filter((id) => id !== vaultId)
      )
    } else {
      form.setValue('selectedVaults', [...selectedVaults, vaultId])
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container mt={8}>
      <Form form={form}>
        <Grid templateColumns="1fr 160px" gap={4}>
          <Heading>Approve investments</Heading>
          <ApproveButton disabled={selectedVaults.length === 0} />
          <Box gridColumn="1 / -1" mt={4}>
            <HeaderSection sections={sections} />
          </Box>
        </Grid>
        {/* TODO: add correct types */}
        {vaults?.map((vault: any) => (
          <Box key={vault.chainId} mt={8} mb={8}>
            <Stack>
              <Flex justifyContent="space-between">
                <Flex alignItems="center" gap={2}>
                  <NetworkIcon networkId={vault.chainId} />
                  <Heading size="md">{networkToName(vault.chainId)} Investments</Heading>
                </Flex>
                <Checkbox onCheckedChange={() => onCheckedChange(vault.id)} />
              </Flex>
              <BottomSection sections={bottomSections} />
            </Stack>
          </Box>
        ))}
        <Flex justifyContent="center">
          <ApproveButton disabled={selectedVaults.length === 0} />
        </Flex>
      </Form>
    </Container>
  )
}
