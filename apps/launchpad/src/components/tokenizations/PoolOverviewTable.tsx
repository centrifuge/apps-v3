import { ShareClass } from '@centrifuge/sdk'
import { Table } from '@chakra-ui/react'

const columns = ['Pool', 'Investments', 'Redemptions', 'Token', 'Networks', 'APY', 'NAV (USDC)', 'TokenPrice']

// TODO: table MAYBE should be reusable, is the only table of this type in the app
export const PoolOverviewTable = () => {
  return (
    <>
      <Table.Root size="sm" variant="outline" striped borderRadius="md" borderColor="1px solid border-primary">
        <Table.Header backgroundColor="white">
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeader key={column}>{column}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body></Table.Body>
      </Table.Root>
    </>
  )
}
