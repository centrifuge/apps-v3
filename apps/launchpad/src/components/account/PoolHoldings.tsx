import { ShareClass } from '@centrifuge/sdk'
import { networkToName, useHoldings } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import DataTable, { ColumnDefinition } from '@centrifuge/ui/src/components/DataTable'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'

// TODO: add pool holdings from sdk once we have it
const HOLDINGS = [
  {
    asset: 'USDC',
    network: 1,
    quantity: '10222',
    price: '1.294',
    value: '13111.48',
    vaults: [
      {
        id: 1,
        name: 'Vault 1',
        network: 1,
      },
    ],
  },
  {
    asset: 'USDC',
    network: '42220',
    quantity: '10222',
    price: '1.294',
    value: '13111.48',
    vaults: [
      {
        id: 2,
        name: 'Vault 1',
        network: 42220,
      },
    ],
  },
]

type Row = {
  id: number
  asset: string
  network: string | number
  quantity: string
  price: string
  value: string
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Asset',
    accessor: 'asset',
    render: (row: Row) => {
      return <Heading fontSize="xs">{row.asset}</Heading>
    },
    width: '100px',
  },
  {
    header: 'Network',
    accessor: 'network',
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
  },
  {
    header: 'Price',
    accessor: 'price',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.price}</Text>
    },
  },
  {
    header: 'Value',
    accessor: 'value',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.value}</Text>
    },
  },
]

export function PoolHoldings({ shareClass }: { shareClass: ShareClass }) {
  // TODO: still broken on sdk side
  const holdings = useHoldings(shareClass)
  console.log(holdings)
  const data: Row[] = HOLDINGS.map((holding, idx) => ({
    id: idx,
    asset: holding.asset,
    network: holding.network,
    quantity: holding.quantity,
    price: holding.price,
    value: holding.value,
    vaults: holding.vaults,
  }))
  return <DataTable data={data} columns={columns} />
}
