import { PoolMetadata } from '@centrifuge/sdk'
import { formatBalance, formatPercentage, usePoolNetworks } from '@centrifuge/shared'
import { Card, NetworkIcons, Tooltip } from '@centrifuge/ui'
import { Flex, Text } from '@chakra-ui/react'
import { RatingPill } from '@components/RatingPill'
import type { PoolDetails } from '@utils/types'
import { FC, ReactNode } from 'react'

type ShareClassDetails = PoolMetadata['shareClasses'] & { weightedAverageMaturity: number }

const Item: FC<{ label: string; value?: string | number | ReactNode }> = ({ label, value }) => (
  <Flex alignItems="center" justifyContent="space-between" my={2}>
    <Text>{label}</Text>
    {typeof value === 'string' || typeof value === 'number' ? <Text textAlign="right">{value}</Text> : value}
  </Flex>
)

export function PoolDetailsOverview({ pool }: { pool: PoolDetails }) {
  const { data: networks } = usePoolNetworks(pool?.id)
  const networkIds = networks?.map((network) => network.chainId)
  const ShareClassId = pool?.shareClasses?.[0]?.details.id.raw
  const metadata: PoolMetadata | null = pool?.metadata
  const { class: mclass, subClass } = metadata?.pool.asset ?? {}
  const shareClassDetails = metadata?.shareClasses[ShareClassId] ?? {}
  console.log({ pool }, ShareClassId, shareClassDetails, networks)

  return (
    <Card>
      <Item label="Asset Type" value={`${mclass}-${subClass}`} />
      <Item label="APY" value={formatPercentage(shareClassDetails?.apyPercentage ?? 0)} />
      <Item
        label="Min Investment"
        value={formatBalance(shareClassDetails?.minInitialInvestment ?? 0, pool?.currency.symbol)}
      />
      <Item label="Investor Type" value={metadata?.pool.investorType} />
      <Item label="Available Networks" value={<NetworkIcons networkIds={networkIds} />} />
      <Item label="Pool Structure" value="Revolving" />
      <Item
        label="Rating"
        value={
          <Flex gap={2}>
            {metadata?.pool.poolRatings?.map((rating) => (
              <Tooltip content={rating.agency} key={rating.agency} showArrow>
                <RatingPill rating={rating} />
              </Tooltip>
            ))}
          </Flex>
        }
      />
      <Item label="Expense Ratio" value="0.25%" />
      <Item
        label="Weighted Average Maturity"
        value={(shareClassDetails as ShareClassDetails)?.weightedAverageMaturity ?? 0}
      />
    </Card>
  )
}
