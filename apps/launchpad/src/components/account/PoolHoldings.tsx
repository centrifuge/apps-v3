import { ShareClass } from '@centrifuge/sdk'
import { networkToName, useHoldings, formatBalance } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { DataTable, ColumnDefinition, ActionsDropdown } from '@centrifuge/ui'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useEffect } from 'react'

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

export function PoolHoldings({
  shareClass,
  setTotalValue,
}: {
  shareClass: ShareClass
  setTotalValue: (value: number) => void
}) {
  const holdings = useHoldings(shareClass)
  const { poolDetails } = usePoolProvider()
  const currencySymbol = poolDetails?.currency.symbol ?? 'USD'

  // TODO: Right now we are assuming that 1USD = 1USDC, this needs to be updated in the future
  const totalValue = holdings?.data?.reduce((acc, holding) => {
    const value = formatBalance(holding.value)
    return acc + (value ? parseFloat(value) : 0)
  }, 0)

  useEffect(() => {
    if (totalValue) {
      setTotalValue(totalValue)
    }
  }, [totalValue])

  if (!holdings || !holdings.data || holdings.data.length === 0) {
    return null
  }

  const data: Row[] = holdings?.data?.map((holding, idx) => ({
    id: idx,
    asset: holding.asset.symbol,
    network: holding.asset.chainId,
    quantity: formatBalance(holding.amount),
    price: formatBalance(holding.value.mul(holding.amount)),
    value: formatBalance(holding.value, currencySymbol),
    vaults: [],
    actions: (row: Row) => {
      return (
        <ActionsDropdown
          items={[
            { label: 'deposit', element: <Text>Deposit</Text> },
            { label: 'withdraw', element: <Text>Withdraw</Text> },
            { label: 'buy', element: <Text>Buy</Text> },
            { label: 'sell', element: <Text>Sell</Text> },
            { label: 'update', element: <Text>Update</Text> },
          ]}
        />
      )
    },
  }))
  return <DataTable data={data} columns={columns} />
}
