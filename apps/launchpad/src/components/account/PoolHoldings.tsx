import { Balance, ShareClass } from '@centrifuge/sdk'
import { networkToName, useHoldings, formatBalance, formatUIBalance } from '@centrifuge/shared'
import { LinkButton, NetworkIcon } from '@centrifuge/ui'
import { DataTable, ColumnDefinition, ActionsDropdown } from '@centrifuge/ui'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useMemo } from 'react'

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

export function PoolHoldings({ shareClass, poolDecimals }: { shareClass: ShareClass; poolDecimals: number }) {
  const { poolId } = useSelectedPool()
  const { data: holdings } = useHoldings(shareClass)

  // TODO: Right now we are assuming that 1USD = 1USDC, this needs to be updated in the future
  const totalValue = useMemo(() => {
    return holdings?.reduce(
      (acc, holding) => {
        return acc.add(holding.value)
      },
      new Balance(0, poolDecimals)
    )
  }, [holdings, poolDecimals])

  if (!holdings || holdings.length === 0) {
    return null
  }

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
                <LinkButton
                  to={`/pool/${poolId?.toString()}/${shareClass.id.toString()}/holdings/deposit/${holding.assetId}`}
                  size="sm"
                  variant="plain"
                >
                  Deposit
                </LinkButton>
              ),
            },
            {
              label: 'withdraw',
              element: (
                <LinkButton
                  to={`/pool/${poolId?.toString()}/${shareClass.id.toString()}/holdings/withdraw/${holding.assetId}`}
                  size="sm"
                  variant="plain"
                >
                  Withdraw
                </LinkButton>
              ),
            },
          ]}
        />
      )
    },
  }))

  return (
    <Stack mt={8} gap={2}>
      <Stack gap={0} mb={4}>
        <Heading size="sm">Holdings</Heading>
        <Flex justify="space-between">
          <Heading size="3xl">{formatBalance(totalValue ?? 0)} USDC</Heading>
          <Flex gap={2}>
            <LinkButton
              to={`/pool/${poolId?.toString()}/${shareClass.id.toString()}/holdings/add`}
              colorPalette="black"
              width="140px"
              size="sm"
              colorScheme="black"
            >
              Add holding
            </LinkButton>
            <LinkButton
              to={`/pool/${poolId?.toString()}/${shareClass.id.toString()}/vaults`}
              colorPalette="yellow"
              width="140px"
              size="sm"
            >
              Vaults
            </LinkButton>
          </Flex>
        </Flex>
      </Stack>
      <DataTable data={data} columns={columns} />
    </Stack>
  )
}
