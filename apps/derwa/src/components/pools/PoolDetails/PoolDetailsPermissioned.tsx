import { PoolDetailsOverview } from './PoolDetailsOverview'
import { Box, Heading } from '@chakra-ui/react'
import { ColumnDefinition, DataTable } from '@centrifuge/ui'
import { PoolDetailsFacts } from './PoolDetailsFacts'

type Row = {
  id: string
  cusip: string
  isin: string
  marketValue: string
  tradeQuantity: string
  maturityDate: string
  portfolioPercentage: string
}

export function PoolDetailsPermissioned() {
  const holdings = [
    {
      id: '912797PE1',
      cusip: '912797PE1',
      isin: 'US912797PE18',
      marketValue: '13,918,329.60 USD',
      tradeQuantity: '13,920,000.00',
      maturityDate: 'Oct 15, 2025',
      portfolioPercentage: '2.1%',
    },
    {
      id: '912797PE2',
      cusip: '912797PE2',
      isin: 'US912797PE19',
      marketValue: '13,918,329.60 USD',
      tradeQuantity: '13,920,000.00',
      maturityDate: 'Oct 15, 2025',
      portfolioPercentage: '2.1%',
    },
  ]

  const columns: ColumnDefinition<Row>[] = [
    {
      header: 'CUSIP',
      accessor: 'cusip',
    },
    {
      header: 'ISIN',
      accessor: 'isin',
    },
    {
      header: 'Market Value (Position...)',
      accessor: 'marketValue',
    },
    {
      header: 'Trade Date Quantity',
      accessor: 'tradeQuantity',
    },
    {
      header: 'Maturity Date',
      accessor: 'maturityDate',
    },
    {
      header: 'Portfolio %',
      accessor: 'portfolioPercentage',
    },
  ]

  return (
    <>
      <PoolDetailsOverview />
      <PoolDetailsFacts />
      <Box>
        <Heading size="lg" mt={8} mb={4}>
          Holdings
        </Heading>
        <DataTable columns={columns} data={holdings as Row[]} size="sm" />
      </Box>
    </>
  )
}
