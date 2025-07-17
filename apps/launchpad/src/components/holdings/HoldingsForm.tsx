import { BalanceInput, createBalanceSchema, Form, safeParse, Select, SubmitButton, useForm } from '@centrifuge/forms'
import { formatUIBalance, Holdings, Portfolio, truncateAddress, useAddress } from '@centrifuge/shared'
import { Card, DisplayInput, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { SummaryBox } from './SummaryBox'
import { useEffect, useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import z from 'zod'
import { useParams } from 'react-router-dom'

export const HoldingsForm = ({
  isWithdraw = false,
  portfolio,
  holdings,
}: {
  isWithdraw?: boolean
  portfolio: Portfolio | undefined
  holdings: Holdings
}) => {
  const params = useParams()
  const holdingId = params.holdingId
  const { address } = useAddress()
  const truncate = truncateAddress(address)

  const holdingsItems = holdings?.map((holding) => ({
    value: holding.assetId.raw.toString(),
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
      holding: z.string().optional(),
      availableBalance: z.custom<Portfolio[number]>().optional(),
      amount: z.string().min(1, { message: 'Amount is required' }),
    })
    .refine(
      (data) => {
        if (!data.availableBalance?.balance || !data.amount) return true
        const currentHolding = holdings.find((h) => h.assetId.raw.toString() === data.holding)
        if (!currentHolding) return true
        const parsedAmount = safeParse(createBalanceSchema(currentHolding.asset.decimals), data.amount)
        if (!parsedAmount) return true
        return !parsedAmount.gt(data.availableBalance.balance)
      },
      (data) => {
        const avail = data.availableBalance?.balance
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
      holding: holdingId || (holdings.length > 0 ? holdings[0].assetId.raw.toString() : ''),
      availableBalance: undefined,
      amount: '',
    },
    mode: 'onChange',
    onSubmit: (values) => {
      // TODO wait on sdk
      console.log(values)
    },
  })

  const { watch, setValue, getValues } = form
  const [amountStr, holdingFromForm] = watch(['amount', 'holding'])

  useEffect(() => {
    if (!portfolio) return

    const selectedHolding = holdings.find((h) => h.assetId.raw.toString() === holdingFromForm)
    const newBalance = portfolio.find((p) => p.currency.address === selectedHolding?.asset.address)

    if (getValues('availableBalance')?.currency.address !== newBalance?.currency.address) {
      setValue('availableBalance', newBalance, { shouldValidate: true })
    }
  }, [holdingFromForm, portfolio, holdings, setValue, getValues])

  const selectedHolding = useMemo(() => {
    return holdings.find((h) => h.assetId.raw.toString() === holdingFromForm)
  }, [holdings, holdingFromForm])

  const availableBalance = watch('availableBalance')

  const parsedAmount = useMemo(() => {
    const decimals = selectedHolding?.asset.decimals ?? 18
    return safeParse(createBalanceSchema(decimals), amountStr) ?? new Balance(0, decimals)
  }, [amountStr, selectedHolding])

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
  }, [availableBalance, isWithdraw, parsedAmount])

  return (
    <Form form={form}>
      <Stack>
        <Select name="holding" label="Available holdings" items={holdingsItems || []} maxWidth="40%" />
        <Box mt={4}>
          <Heading>
            {isWithdraw ? `Withdraw ${selectedHolding?.asset.symbol}` : `Deposit ${selectedHolding?.asset.symbol}`}
          </Heading>
          <Card mt={4} pt={4} pb={4}>
            <Grid gridTemplateColumns="1fr 1fr" gap={4}>
              <Stack gap={2}>
                <DisplayInput label="Connected wallet" value={`Connected wallet (${truncate})`} size="sm" />
                <BalanceInput
                  name="amount"
                  label="Amount"
                  size="sm"
                  currency={selectedHolding?.asset.symbol}
                  decimals={selectedHolding?.asset.decimals}
                />
                <SubmitButton colorPalette="yellow" size="sm" disabled={availableBalance?.balance.isZero()}>
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
