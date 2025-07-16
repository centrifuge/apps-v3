import { BalanceInput, Form, Select, SubmitButton, useForm } from '@centrifuge/forms'
import { truncateAddress, useAddress } from '@centrifuge/shared'
import { Card, DisplayInput, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { SummaryBox } from './SummaryBox'
import { useEffect, useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'

export const HoldingsForm = ({
  isWithdraw = false,
  portfolio,
  holdings,
}: {
  isWithdraw?: boolean
  portfolio: any
  holdings: any[]
}) => {
  const { address } = useAddress()
  const truncate = truncateAddress(address)

  const holdingsItems = holdings?.map((holding) => ({
    value: holding.asset.address,
    label: holding.asset.name,
    children: (
      <Flex gap={2} alignItems="center">
        <NetworkIcon networkId={holding.asset.chainId} boxSize="16px" />
        <Text>{holding.asset.name}</Text>
      </Flex>
    ),
  }))

  const form = useForm({
    defaultValues: {
      holding: '',
      availableBalance: new Balance(0, 6),
      amount: new Balance(0, 6),
    },
    mode: 'onChange',
    onSubmit: (values) => {
      // TODO wait on sdk
      console.log(values)
    },
  })

  const { watch } = form
  const holding = watch('holding')
  const availableBalance = watch('availableBalance')
  const amount = watch('amount')

  const summaryItems = useMemo(() => {
    return [
      {
        label: 'Available balance',
        balance: availableBalance,
        currency: 'USDC',
      },
      {
        label: isWithdraw ? 'Withdraw amount' : 'Deposit amount',
        balance: amount,
        currency: 'USDC',
      },
    ]
  }, [availableBalance, isWithdraw, amount])

  useEffect(() => {
    if (portfolio?.length) {
      const matchingBalance = portfolio.find((balance: any) => balance.currency.address === holding)
      form.setValue('availableBalance', matchingBalance?.balance ?? new Balance(0, 0))
    }
  }, [portfolio, holding])

  const isDisabled = useMemo(() => {
    return Number(amount) === 0 || Number(availableBalance) === 0 || Number(amount) > availableBalance.toFloat()
  }, [amount, availableBalance])

  return (
    <Form form={form}>
      <Stack>
        <Select name="holding" label="Available holdings" items={holdingsItems || []} maxWidth="40%" />
        <Box mt={4}>
          <Heading>{isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}</Heading>
          <Card mt={4} pt={4} pb={4}>
            <Grid gridTemplateColumns="1fr 1fr" gap={4}>
              <Stack gap={2}>
                <DisplayInput label="Connected wallet" value={`Connected wallet (${truncate})`} size="sm" />
                <BalanceInput name="amount" label="Amount" size="sm" currency="USDC" />
                <SubmitButton colorPalette="yellow" size="sm" disabled={isDisabled}>
                  {isWithdraw ? 'Withdraw' : 'Deposit'}
                </SubmitButton>
              </Stack>
              <SummaryBox
                title="Transaction summary"
                summaryItems={summaryItems}
                infoText={
                  isWithdraw
                    ? 'Stablecoins will be transferred to the specified withdrawal addresses on the asset network. '
                    : 'Stablecoins will be transferred to the escrow account of the pool on the assets networks. Wallet must be connected to the network of the asset.'
                }
              />
            </Grid>
          </Card>
        </Box>
      </Stack>
    </Form>
  )
}
