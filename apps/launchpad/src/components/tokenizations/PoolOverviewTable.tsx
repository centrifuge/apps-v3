import { useAllPoolDetails } from '@centrifuge/shared'
import { Box, Heading, Image, Stack } from '@chakra-ui/react'
import DataTable, { ColumnDefinition } from './DataTable'
import { ipfsToHttp } from '@centrifuge/shared/src/utils/formatting'

type Row = {
  id: string
  poolName: string
  iconUri: string
  token: string
  apy: string
  tokenPrice: string
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Pool',
    accessor: 'name',
    render: ({ poolName, iconUri }: Row) => {
      return (
        <Box>
          <Image src={ipfsToHttp(iconUri ?? '')} alt={poolName} />
          <Heading>{poolName}</Heading>
        </Box>
      )
    },
  },
]

export const PoolOverviewTable = () => {
  const { data: pools } = useAllPoolDetails()

  const data =
    pools?.map((pool) => {
      const shareClassDetails = Object.values(pool.shareClasses)
      return {
        id: pool.id,
        name: pool.metadata?.pool.name,
        icon: pool.metadata?.pool.icon,
        shareClasses: shareClassDetails.map((sc) => ({
          token: sc.details.symbol,
          apy: pool.metadata?.shareClasses[0]?.apy ?? '-',
          tokenPrice: sc.details.navPerShare,
        })),
      }
    }) ?? []

  const flattenedData = data.flatMap((d) =>
    d.shareClasses.map((sc) => ({
      id: `${d.id}-${sc.token}`,
      poolName: d.name,
      iconUri: d.icon?.uri,
      token: sc.token,
      apy: sc.apy,
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
