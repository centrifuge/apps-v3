import { useAllPoolDetails } from '@centrifuge/shared'
import { Flex, Heading, Image, Stack } from '@chakra-ui/react'
import DataTable, { ColumnDefinition } from './DataTable'
import { ipfsToHttp } from '@centrifuge/shared/src/utils/formatting'
import { Balance } from '@centrifuge/sdk'
import { BalanceDisplay, NetworkIcon } from '@centrifuge/ui'

type Row = {
  id: string
  poolName: string
  iconUri: string
  token: string
  networks: number
  apy: string
  nav: Balance
  tokenPrice: Balance
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
    render: () => <NetworkIcon network="ethereum" />,
  },
  {
    header: 'APY',
    accessor: 'apy',
  },
  {
    header: 'Nav',
    accessor: 'nav',
    render: ({ nav }) => <BalanceDisplay balance={nav} />,
  },
  {
    header: 'Token Price',
    accessor: 'tokenPrice',
    render: ({ tokenPrice }) => <BalanceDisplay balance={tokenPrice} />,
  },
]

export const PoolOverviewTable = () => {
  const { data: pools } = useAllPoolDetails()

  const data =
    pools?.map((pool) => {
      const shareClassDetails = Object.values(pool.shareClasses)
      return {
        // currency: pool.currency,
        id: pool.id,
        name: pool.metadata?.pool.name ?? 'RWA Portfolio',
        icon: pool.metadata?.pool.icon,
        shareClasses: shareClassDetails.map((sc) => ({
          token: sc.details.symbol,
          apy: pool.metadata?.shareClasses?.apy ?? '-',
          tokenPrice: sc.details.navPerShare,
          totalIssuance: sc.details.totalIssuance,
          networks: sc.shareClass.pool.chainId,
        })),
      }
    }) ?? []

  const flattenedData = data.flatMap((d) =>
    d.shareClasses.map((sc) => ({
      // currency: d.currency,
      id: `${d.id}-${sc.token}`,
      poolName: d.name,
      iconUri: d.icon?.uri,
      token: sc.token,
      networks: sc.networks,
      apy: sc.apy,
      nav: sc.totalIssuance,
      tokenPrice: sc.tokenPrice,
    }))
  )

  return (
    <Stack>
      <Heading>Pool overview</Heading>
      <DataTable columns={columns} data={flattenedData ?? []} />
    </Stack>
  )
}
