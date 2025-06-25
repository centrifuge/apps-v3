import { HStack, Image, Text, Button, Tooltip, chakra } from '@chakra-ui/react'
import { FaEthereum, FaCog } from 'react-icons/fa'
import { DataTable, Column } from '../shared/DataTable'

export function PoolOverviewTable() {
  const columns = [
    {
      key: 'pool',
      header: 'Pool',
      render: (p) => (
        <HStack>
          <Image boxSize="24px" src={p.iconUrl} alt={p.name} />
          <Text fontWeight="medium">{p.name}</Text>
        </HStack>
      ),
      minW: '200px',
    },
    { key: 'investments', header: 'Investments', accessor: 'investments', isNumeric: true },
    { key: 'redemptions', header: 'Redemptions', accessor: 'redemptions', isNumeric: true },
    {
      key: 'token',
      header: 'Token',
      render: (p) => (
        <HStack>
          {p.networkIcon ?? <FaEthereum />}
          <Text>{p.tokenSymbol}</Text>
        </HStack>
      ),
    },
    {
      key: 'apy',
      header: (
        <HStack>
          <Text>APY</Text>
          <chakra.span fontSize="xs">▼</chakra.span>
        </HStack>
      ),
      accessor: 'apy',
      isNumeric: true,
    },
    {
      key: 'nav',
      header: (
        <HStack>
          <Text>NAV (USDC)</Text>
          <chakra.span fontSize="xs">▼</chakra.span>
        </HStack>
      ),
      accessor: 'nav',
      isNumeric: true,
    },
    {
      key: 'price',
      header: (
        <HStack>
          <Text>Token price</Text>
          <chakra.span fontSize="xs">▼</chakra.span>
        </HStack>
      ),
      accessor: 'price',
      isNumeric: true,
    },
    {
      key: 'actions',
      header: '',
      render: (p) => <Button size="xs">Accounts</Button>,
    },
  ]

  return <DataTable columns={columns} data={[]} />
}
