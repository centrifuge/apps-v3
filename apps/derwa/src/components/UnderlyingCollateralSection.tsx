import { Box, Flex, Heading } from '@chakra-ui/react'
import type { PoolMetadata } from '@centrifuge/sdk'
import { formatPercentage } from '@centrifuge/shared'
import DataTable, { type ColumnDefinition } from '@components/DataTable'
import { RatingPill } from '@components/RatingPill'
import { mockMetadata } from '@utils/mockMetadata'
import { Tooltip } from '@centrifuge/ui'

type Row = {
  id: number
  fund: string
  assetType: string
  targetAPY: string
  investorType: string
  fundRating: PoolMetadata['pool']['poolRatings']
  expenseRatio: string
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Funding',
    accessor: 'fund',
  },
  {
    header: 'Asset type',
    accessor: 'assetType',
  },
  {
    header: 'Target APY',
    accessor: 'targetAPY',
  },
  {
    header: 'Investor type',
    accessor: 'investorType',
  },
  {
    header: 'Fund rating',
    accessor: 'fundRating',
    render: (value: Row['fundRating']) => {
      if (!value) return null
      return (
        <Flex gap={2}>
          {value.map((rating) => (
            <Tooltip content="This is the tooltip content" key={rating.agency} showArrow>
              <RatingPill rating={rating} />
            </Tooltip>
          ))}
        </Flex>
      )
    },
  },
  {
    header: 'Expense ratio',
    accessor: 'expenseRatio',
    render: (value: string) => {
      return <Box>{value}</Box>
    },
  },
]

export const UnderlyingCollateralSection = () => {
  const data = Object.values(mockMetadata.shareClasses || {}).map((sc, idx) => ({
    id: idx,
    fund: mockMetadata.pool.name,
    assetType: mockMetadata.pool.asset.class,
    targetAPY: formatPercentage(sc.apyPercentage),
    investorType: mockMetadata.pool.investorType,
    fundRating: mockMetadata.pool.poolRatings.length > 0 ? mockMetadata.pool.poolRatings : 'N/A',
    expenseRatio: '0.50%',
  }))

  return (
    <Flex flexDirection="column" gap={4}>
      <Heading size="lg">Underlying Collateral</Heading>
      <DataTable columns={columns} data={data as Row[]} size="sm" />
    </Flex>
  )
}
