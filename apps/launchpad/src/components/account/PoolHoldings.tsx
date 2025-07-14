import { ShareClass } from '@centrifuge/sdk'
import { networkToName, useHoldings } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { DataTable, ColumnDefinition, ActionsDropdown } from '@centrifuge/ui'
import { Flex, Heading, Text } from '@chakra-ui/react'

// TODO: add pool holdings from sdk once we have it
const HOLDINGS = [
  {
    asset: 'USDC',
    network: 1,
    quantity: '10300',
    price: '1.300',
    value: '14111.48',
    vaults: [
      {
        id: 1,
        name: 'Vault 1',
        network: 1,
      },
    ],
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
  },
  {
    asset: 'USDC',
    network: '42220',
    quantity: '10222',
    price: '1.400',
    value: '13111.48',
    vaults: [
      {
        id: 2,
        name: 'Vault 1',
        network: 42220,
      },
    ],
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
  },
]

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

export function PoolHoldings({ shareClass }: { shareClass: ShareClass }) {
  // TODO: still broken on sdk side
  const holdings = useHoldings(shareClass)
  const data: Row[] = HOLDINGS.map((holding, idx) => ({
    id: idx,
    asset: holding.asset,
    network: holding.network,
    quantity: holding.quantity,
    price: holding.price,
    value: holding.value,
    vaults: holding.vaults,
    actions: holding.actions ?? undefined,
  }))
  return <DataTable data={data} columns={columns} />
}
