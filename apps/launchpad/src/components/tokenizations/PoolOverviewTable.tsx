import { Table } from '@chakra-ui/react'

const columns = ['Pool', 'Investments', 'Redemptions', 'Token', 'Networks', 'APY', 'NAV (USDC)', 'TokenPrice']
const pools = [
  {
    name: 'Janus Henderson Anemoy Treasury Fund',
    investments: 1000000,
    redemptions: 1000000,
    token: 'SC1',
    networks: 1000000,
    apy: 1000000,
    nav: 1000000,
    tokenPrice: 1000000,
  },
  {
    name: 'Janus AAA CLO ETF',
    investments: 1000000,
    redemptions: 1000000,
    token: 1000000,
    networks: 1000000,
    apy: 1000000,
    nav: 1000000,
    tokenPrice: 1000000,
  },
]

export const PoolOverviewTable = () => {
  return (
    <>
      <Table.Root size="sm" variant="outline" striped>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeader key={column}>{column}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell textAlign="end">{item.price}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}
