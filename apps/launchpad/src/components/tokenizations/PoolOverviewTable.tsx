import { Link } from 'react-router'
import { Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import { Balance, PoolId } from '@centrifuge/sdk'
import { formatUIBalance, PoolDetails, useAddress, useAllPoolDetails, usePoolsByManager } from '@centrifuge/shared'
import { ipfsToHttp } from '@centrifuge/shared/src/utils/formatting'
import { BalanceDisplay, DataTable, NetworkIcon, ColumnDefinition } from '@centrifuge/ui'
import { mockMetadata } from './mockMetadata'

type Row = {
  id: string
  poolName: string
  iconUri?: string
  token: string
  networks: number
  apy: number
  nav: Balance
  tokenPrice: Balance
  shareClassId: string
  isManager: boolean
  poolCurrency: PoolDetails['currency']
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Pool',
    accessor: 'poolName',
    render: ({ poolName, iconUri }: Row) => {
      return (
        <Flex alignItems="center">
          <Image src={ipfsToHttp(iconUri ?? '')} alt={poolName} height="36px" />
          <Heading size="sm">{poolName}</Heading>
        </Flex>
      )
    },
  },
  {
    header: 'Token',
    accessor: 'token',
  },
  {
    header: 'Networks',
    accessor: 'networks',
    textAlign: 'center',
    render: ({ networks }: Row) => <NetworkIcon networkId={networks} width="100%" />,
  },
  {
    header: 'APY',
    accessor: 'apy',
    textAlign: 'center',
    render: ({ apy }: Row) => <Text>{apy.toString()}</Text>,
  },
  {
    header: 'NAV',
    accessor: 'nav',
    textAlign: 'center',
    render: ({ nav }: Row) => <BalanceDisplay balance={nav} />,
  },
  {
    header: 'Token price',
    accessor: 'tokenPrice',
    render: ({ tokenPrice, poolCurrency }: Row) => (
      <Text>{formatUIBalance(tokenPrice, { precision: 6, currency: poolCurrency.symbol })}</Text>
    ),
  },
  {
    header: '',
    render: ({ id, shareClassId, isManager }: Row) => {
      const poolId = id.split('-')[0]
      return (
        <Link to={`/pool/${poolId}/${shareClassId}/account`}>
          <Button colorPalette="gray" size="xs" width="100%" disabled={!isManager}>
            Select
          </Button>
        </Link>
      )
    },
  },
]

export const PoolOverviewTable = ({ poolIds }: { poolIds: PoolId[] }) => {
  const { address } = useAddress()
  const { data: pools, isLoading: isLoadingPools } = useAllPoolDetails(poolIds)
  const { data: poolsByManager, isLoading: isLoadingPoolsByManager } = usePoolsByManager(address)

  const data =
    pools?.map((pool: PoolDetails) => {
      const shareClassDetails = Object.values(pool.shareClasses)
      const metaShareClassKeys = pool.metadata?.shareClasses ? Object.keys(pool.metadata?.shareClasses) : []
      const apy = pool.metadata?.shareClasses[metaShareClassKeys[0]].apyPercentage ?? 0

      return {
        id: pool.id,
        name: pool.metadata?.pool.name ?? 'RWA Portfolio',
        icon: pool.metadata?.pool.icon ?? mockMetadata.pool.icon,
        shareClasses: shareClassDetails.map((sc) => ({
          token: sc.details.symbol,
          apy,
          tokenPrice: sc.details.pricePerShare.toFloat().toString(),
          totalIssuance: sc.details.totalIssuance,
          networks: sc.shareClass.pool.chainId,
          shareClassId: sc.shareClass.id,
        })),
        isManager: !!poolsByManager?.find((p) => p.id.raw === pool.id.raw),
        poolCurrency: pool.currency,
      }
    }) ?? []

  const flattenedData = data.flatMap((d: any) =>
    d.shareClasses.map((sc: any) => ({
      id: `${d.id}-${sc.token}`,
      poolName: d.name,
      iconUri: d.icon?.uri,
      token: sc.token,
      networks: sc.networks,
      apy: sc.apy,
      nav: sc.totalIssuance,
      tokenPrice: sc.tokenPrice,
      shareClassId: sc.shareClassId,
      isManager: d.isManager,
      poolCurrency: d.poolCurrency,
    }))
  )

  if (isLoadingPools || isLoadingPoolsByManager) return null

  return (
    <Stack gap={4}>
      <Heading size="md">Pool overview</Heading>
      {<DataTable columns={columns} data={flattenedData ?? []} />}
    </Stack>
  )
}
