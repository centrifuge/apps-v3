import { BalanceInput, createBalanceSchema, Form, safeParse, Select, SubmitButton, useForm } from '@centrifuge/forms'
import { formatUIBalance, Holdings, Portfolio, truncateAddress, useAddress } from '@centrifuge/shared'
import { Card, DisplayInput, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { SummaryBox } from './SummaryBox'
import { useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import z from 'zod'

export const HoldingsForm = ({
  isWithdraw = false,
  portfolio,
  holdings,
}: {
  isWithdraw?: boolean
  portfolio: Portfolio | undefined
  holdings: Holdings
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

  const schema = z
    .object({
      holding: z.custom<Holdings[number]>(),
      availableBalance: z.custom<Portfolio[number]>().optional(),
      amount: createBalanceSchema(
        holdings[0].asset.decimals,
        z.number().min(1, { message: 'Amount must be at least 1' })
      ),
    })
    .refine(
      (data) => {
        if (!data.availableBalance?.balance) {
          return true
        }
        return !data.amount.gt(data.availableBalance.balance)
      },
      (data) => {
        const avail = data.availableBalance?.balance
        console.log(data)
        return {
          message: `Amount cannot exceed your available balance of ${formatUIBalance(avail, {
            precision: 2,
            currency: data.availableBalance?.currency.symbol,
            tokenDecimals: data.availableBalance?.currency.decimals,
          })}`,
          path: ['amount'],
        }
      }
    )

  const form = useForm({
    schema: schema,
    defaultValues: {
      holding: holdings[0],
      availableBalance: undefined,
      amount: '',
    },
    mode: 'onChange',
    onSubmit: (values) => {
      // TODO wait on sdk
      console.log(values)
    },
  })

  const { watch } = form
  const [amount, availableBalance] = watch(['amount', 'availableBalance'])

  const parsedAmount = useMemo(
    () => safeParse(schema._def.schema.shape.amount, amount) ?? new Balance(0, 0),
    [amount, schema]
  )

  const summaryItems = useMemo(() => {
    return [
      {
        label: 'Available balance',
        balance: availableBalance?.balance ?? new Balance(0, 0),
      },
      {
        label: isWithdraw ? 'Withdraw amount' : 'Deposit amount',
        balance: parsedAmount,
      },
    ]
  }, [availableBalance, isWithdraw, amount])

  const isDisabled = useMemo(() => {
    return Number(amount) === 0 || Number(availableBalance) === 0 || Number(amount) > Number(availableBalance)
  }, [amount, availableBalance])

  return (
    <Form form={form}>
      <Stack>
        <Select
          name="holding"
          label="Available holdings"
          items={holdingsItems || []}
          maxWidth="40%"
          onSelectChange={(value) => {
            const availableBalance = portfolio?.find((item) => item.currency.address === value)
            form.setValue('availableBalance', availableBalance)
            form.setValue('holding', value)
          }}
        />
        <Box mt={4}>
          <Heading>{isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}</Heading>
          <Card mt={4} pt={4} pb={4}>
            <Grid gridTemplateColumns="1fr 1fr" gap={4}>
              <Stack gap={2}>
                <DisplayInput label="Connected wallet" value={`Connected wallet (${truncate})`} size="sm" />
                <BalanceInput
                  name="amount"
                  label="Amount"
                  size="sm"
                  currency={availableBalance?.currency.symbol}
                  decimals={availableBalance?.currency.decimals}
                />
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
