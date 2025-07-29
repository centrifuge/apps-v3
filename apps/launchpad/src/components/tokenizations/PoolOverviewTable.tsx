import { Link } from 'react-router'
import { Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import { Balance, PoolId } from '@centrifuge/sdk'
import { useAllPoolDetails } from '@centrifuge/shared'
import { ipfsToHttp } from '@centrifuge/shared/src/utils/formatting'
import { BalanceDisplay, Loader, NetworkIcon } from '@centrifuge/ui'
import DataTable, { ColumnDefinition } from './DataTable'
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
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Pool',
    accessor: 'name',
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
    render: ({ networks }) => <NetworkIcon networkId={networks} width="100%" />,
  },
  {
    header: 'APY',
    accessor: 'apy',
    textAlign: 'center',
    render: ({ apy }) => <Text>{apy.toString()}</Text>,
  },
  {
    header: 'Nav',
    accessor: 'nav',
    textAlign: 'center',
    render: ({ nav }) => <BalanceDisplay balance={nav} />,
  },
  {
    header: 'Token Price',
    accessor: 'tokenPrice',
    render: ({ tokenPrice }) => <BalanceDisplay balance={tokenPrice} />,
  },
  {
    header: '',
    accessor: '',
    render: ({ id, shareClassId }) => {
      const poolId = id.split('-')[0]
      return (
        <Link to={`/pool/${poolId}/${shareClassId}/account`}>
          <Button colorPalette="black" size="xs">
            Accounts
          </Button>
        </Link>
      )
    },
  },
]

export const PoolOverviewTable = ({ poolIds }: { poolIds: PoolId[] }) => {
  const { data: pools, isLoading: isLoadingPools } = useAllPoolDetails(poolIds)

  const data =
    pools?.map((pool: any) => {
      const shareClassDetails = Object.values(pool.shareClasses)
      const metaShareClassKeys = pool.metadata?.shareClasses ? Object.keys(pool.metadata?.shareClasses) : []
      const apy = pool.metadata?.shareClasses[metaShareClassKeys[0]].apyPercentage ?? 0

      return {
        id: pool.id,
        name: pool.metadata?.pool.name ?? 'RWA Portfolio',
        icon: pool.metadata?.pool.icon ?? mockMetadata.pool.icon,
        shareClasses: shareClassDetails.map((sc: any) => ({
          token: sc.details.symbol,
          apy,
          tokenPrice: sc.details.pricePerShare,
          totalIssuance: sc.details.totalIssuance,
          networks: sc.shareClass.pool.chainId,
          shareClassId: sc.shareClass.id,
        })),
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
    }))
  )

  if (isLoadingPools) return null

  return (
    <Stack gap={4}>
      <Heading size="md">Pool overview</Heading>
      {<DataTable columns={columns} data={flattenedData ?? []} />}
    </Stack>
  )
}
