import { useMemo, useState } from 'react'
import { Balance, ShareClass } from '@centrifuge/sdk'
import { networkToName, formatUIBalance, Holdings, PoolDetails } from '@centrifuge/shared'
import { Button, NetworkIcon } from '@centrifuge/ui'
import { DataTable, ColumnDefinition, ActionsDropdown } from '@centrifuge/ui'
import { Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { AddHoldingForm } from './AddHoldingForm'
import { DepositHolding } from './DepositHolding'
import WithdrawHolding from './WithdrawHolding'

type Row = {
  id: number
  asset: string
  network: string | number
  quantity: string
  price: string
  value: string
  actions?: (row: Row) => React.ReactNode
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Asset',
    accessor: 'asset',
    render: (row: Row) => {
      return <Heading fontSize="xs">{row.asset}</Heading>
    },
    sortKey: 'asset',
    width: '100px',
  },
  {
    header: 'Network',
    accessor: 'network',
    sortKey: 'network',
    render: (row: Row) => {
      return (
        <Flex align="center" gap={2}>
          <NetworkIcon networkId={Number(row.network)} />
          <Heading fontSize="xs">{networkToName(Number(row.network))}</Heading>
        </Flex>
      )
    },
  },
  {
    header: 'Quantity',
    accessor: 'quantity',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.quantity}</Text>
    },
    sortKey: 'quantity',
  },
  {
    header: 'Price',
    accessor: 'price',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.price}</Text>
    },
    sortKey: 'price',
  },
  {
    header: 'Value',
    accessor: 'value',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.value}</Text>
    },
    sortKey: 'value',
  },
]

export function HoldingsTable({
  holdings,
  poolCurrency,
}: {
  holdings: Holdings
  shareClass: ShareClass
  poolCurrency: PoolDetails['currency']
}) {
  const [selectedHolding, setSelectedHolding] = useState<Holdings[number] | undefined>(undefined)
  const [openModal, setOpenModal] = useState<{ add: boolean; deposit: boolean; withdraw: boolean }>({
    add: false,
    deposit: false,
    withdraw: false,
  })
  const poolDecimals = poolCurrency?.decimals ?? 18

  const totalValue = useMemo(() => {
    const zero = new Balance(0, poolDecimals)

    return holdings?.reduce((acc, holding) => {
      const normalized = new Balance(holding.value.toBigInt(), poolDecimals)
      return acc.add(normalized)
    }, zero)
  }, [holdings, poolDecimals])

  const data: Row[] = holdings?.map((holding, idx) => ({
    id: idx,
    asset: holding.asset.symbol,
    network: holding.asset.chainId,
    quantity: formatUIBalance(holding.amount, { precision: 2, tokenDecimals: holding.asset.decimals }),
    price: formatUIBalance(holding.price.toFloat(), { precision: 2 }),
    value: formatUIBalance(holding.value, { precision: 2, tokenDecimals: poolDecimals }),
    vaults: [],
    actions: () => {
      return (
        <ActionsDropdown
          items={[
            {
              label: 'deposit',
              element: (
                <Button
                  size="sm"
                  variant="plain"
                  label="Deposit"
                  onClick={() => {
                    setSelectedHolding(holding)
                    setOpenModal({ ...openModal, deposit: true })
                  }}
                />
              ),
            },
            {
              label: 'withdraw',
              element: (
                <Button
                  size="sm"
                  variant="plain"
                  label="Withdraw"
                  onClick={() => {
                    setSelectedHolding(holding)
                    setOpenModal({ ...openModal, withdraw: true })
                  }}
                />
              ),
            },
          ]}
        />
      )
    },
  }))

  return (
    <Stack gap={2}>
      <Stack gap={0} mb={4}>
        <Heading size="sm">Holdings</Heading>
        <Flex justify="space-between">
          <Heading size="3xl">
            {formatUIBalance(totalValue, { precision: 2, tokenDecimals: poolDecimals, currency: poolCurrency?.symbol })}
          </Heading>
          <Flex gap={2}>
            <Button
              colorPalette="black"
              size="sm"
              onClick={() => setOpenModal({ ...openModal, add: true })}
              label="Add holding"
            />
          </Flex>
        </Flex>
      </Stack>
      {holdings.length > 0 ? <DataTable data={data} columns={columns} /> : <VStack>No holdings found</VStack>}
      <AddHoldingForm openModal={openModal} setOpenModal={(modal) => setOpenModal({ ...openModal, ...modal })} />
      <DepositHolding
        openModal={openModal}
        setOpenModal={(modal) => setOpenModal({ ...openModal, ...modal })}
        selectedHolding={selectedHolding}
      />
      <WithdrawHolding
        openModal={openModal}
        setOpenModal={(modal) => setOpenModal({ ...openModal, ...modal })}
        selectedHolding={selectedHolding}
      />
    </Stack>
  )
}
