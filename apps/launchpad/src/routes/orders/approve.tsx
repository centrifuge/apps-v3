import z from 'zod'
import { useEffect, useMemo } from 'react'
import { Button, NetworkIcon, Checkbox, Card, Loader } from '@centrifuge/ui'
import { Container, Grid, Heading, Box, Stack, Flex } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { networkToName } from '@centrifuge/shared'
import { Form, useForm } from '@centrifuge/forms'
import { SectionWithCheckbox, SectionWithBalanceInput } from './Sections'
import { usePendingAmounts } from '@centrifuge/shared/src/hooks/useShareClass'

const schema = z.object({
  selectedVaults: z.array(z.number()),
  investments: z.array(z.number()),
})

export const ApproveButton = ({ disabled }: { disabled: boolean }) => {
  return <Button label="Approve" onClick={() => {}} size="sm" width={163} disabled={disabled} />
}

export default function Approve() {
  const { isLoading, shareClass } = usePoolProvider()
  const { data: pendingAmounts } = usePendingAmounts(shareClass?.shareClass)

  const investments = useMemo(() => {
    return pendingAmounts?.map((investment, index) => {
      return {
        ...investment,
        chainId: investment.chainId,
        id: `${investment.chainId}-${index}`,
        balance: investment.pendingDeposit,
      }
    })
  }, [pendingAmounts])

  useEffect(() => setValue('selectedVaults', []), [])
  useEffect(() => {
    if (investments) {
      setValue(
        'investments',
        investments.map((investment: any) => investment.pendingInvestCurrency)
      )
    }
  }, [investments])

  const approvedInvestments = useMemo(() => {
    return pendingAmounts?.map((p) => p.approvedDeposit).reduce((acc, curr) => acc + curr.toFloat(), 0)
  }, [pendingAmounts])

  const sections = [
    {
      title: 'Approved investments',
      value: approvedInvestments ?? 0,
      currency: shareClass?.details.symbol ?? 'USDC',
      decimals: 2,
    },
    {
      title: 'Total investments',
      value: 0,
      currency: 'USDC',
      decimals: 2,
    },
  ]

  const form = useForm({
    schema,
    defaultValues: {
      selectedVaults: [],
      investments: [],
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

  const onMulticallCheckedChange = (vault: any) => {}

  if (isLoading) {
    return <Loader />
  }

  if (!pendingAmounts?.length) return null

  return (
    <Container mt={8}>
      <Form form={form}>
        <Grid templateColumns="1fr 160px" gap={4} alignItems="center">
          <Heading>Approve investments</Heading>
          <ApproveButton disabled={selectedVaults.length === 0} />
          <Box gridColumn="1 / -1" mt={4}>
            <Card>
              <SectionWithBalanceInput sections={sections} />
            </Card>
          </Box>
        </Grid>
        {/* TODO: add correct types */}
        {investments?.map((investment: any, index: number) => (
          <Box key={investment.id} mt={8} mb={8}>
            <Stack>
              <Flex justifyContent="space-between">
                <Flex alignItems="center" gap={2}>
                  <NetworkIcon networkId={investment.chainId} />
                  <Heading size="md">{networkToName(investment.chainId)} Investments</Heading>
                </Flex>
                <Checkbox onCheckedChange={() => onCheckedChange(investment.chainId)} />
              </Flex>
              <SectionWithCheckbox
                title={`investments.${index}`}
                checkboxLabel="Approve and issue"
                label="Approve investments"
                onCheckedChange={() => onMulticallCheckedChange(investment)}
              />
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
