import { GrDownload } from 'react-icons/gr'
import { Box, Button, Flex, Grid, Heading, Icon, Text } from '@chakra-ui/react'
// import type { PoolMetadata } from '@centrifuge/sdk'
import { formatPercentage } from '@centrifuge/shared'
import { LineChart } from '@components/charts/LineChart'
import type { PoolDetails } from '@utils/types'

export const chartData = [
  {
    timestamp: '2025-05-05T00:00:00.000Z',
    price: 920,
    tvl: 921.0,
  },
  {
    timestamp: '2025-05-06T00:00:00.000Z',
    price: 923,
    tvl: 924.0,
  },
  {
    timestamp: '2025-05-07T00:00:00.000Z',
    price: 926,
    tvl: 928.0,
  },
  {
    timestamp: '2025-05-08T00:00:00.000Z',
    price: 929,
    tvl: 932.0,
  },
  {
    timestamp: '2025-05-09T00:00:00.000Z',
    price: 932,
    tvl: 936.0,
  },
  {
    timestamp: '2025-05-10T00:00:00.000Z',
    price: 935,
    tvl: 940.0,
  },
  {
    timestamp: '2025-05-11T00:00:00.000Z',
    price: 938,
    tvl: 944.0,
  },
  {
    timestamp: '2025-05-12T00:00:00.000Z',
    price: 941,
    tvl: 948.0,
  },
  {
    timestamp: '2025-05-13T00:00:00.000Z',
    price: 944,
    tvl: 952.0,
  },
  {
    timestamp: '2025-05-14T00:00:00.000Z',
    price: 940,
    tvl: 946.0,
  },
  {
    timestamp: '2025-05-15T00:00:00.000Z',
    price: 941,
    tvl: 942,
  },
  {
    timestamp: '2025-05-16T00:00:00.000Z',
    price: 942,
    tvl: 943,
  },
  {
    timestamp: '2025-05-17T00:00:00.000Z',
    price: 956,
    tvl: 968.0,
  },
  {
    timestamp: '2025-05-18T00:00:00.000Z',
    price: 959,
    tvl: 972.0,
  },
  {
    timestamp: '2025-05-19T00:00:00.000Z',
    price: 962,
    tvl: 976.0,
  },
  {
    timestamp: '2025-05-20T00:00:00.000Z',
    price: 965,
    tvl: 980.0,
  },
  {
    timestamp: '2025-05-21T00:00:00.000Z',
    price: 971,
    tvl: 988.0,
  },
  {
    timestamp: '2025-05-22T00:00:00.000Z',
    price: 992,
    tvl: 992.0,
  },
  {
    timestamp: '2025-05-23T00:00:00.000Z',
    price: 996,
    tvl: 996.0,
  },
  {
    timestamp: '2025-05-24T00:00:00.000Z',
    price: 999,
    tvl: 1000.0,
  },
  {
    timestamp: '2025-05-25T00:00:00.000Z',
    price: 980,
    tvl: 1000.0,
  },
  {
    timestamp: '2025-05-26T00:00:00.000Z',
    price: 983,
    tvl: 1004.0,
  },
  {
    timestamp: '2025-05-27T00:00:00.000Z',
    price: 986,
    tvl: 1008.0,
  },
  {
    timestamp: '2025-05-28T00:00:00.000Z',
    price: 989,
    tvl: 1012.0,
  },
  {
    timestamp: '2025-05-29T00:00:00.000Z',
    price: 992,
    tvl: 1016.0,
  },
  {
    timestamp: '2025-05-30T00:00:00.000Z',
    price: 995,
    tvl: 1020.0,
  },
  {
    timestamp: '2025-05-31T00:00:00.000Z',
    price: 998,
    tvl: 1024.0,
  },
  {
    timestamp: '2025-06-01T00:00:00.000Z',
    price: 1001,
    tvl: 1028.0,
  },
  {
    timestamp: '2025-06-02T00:00:00.000Z',
    price: 1004,
    tvl: 1032.0,
  },
  {
    timestamp: '2025-06-03T00:00:00.000Z',
    price: 1007,
    tvl: 1036.0,
  },
]

export function SmallCircle({ color }: { color: string }) {
  return <Box w="12px" h="12px" bg={color} borderRadius="full" />
}

export function LegendItem({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <Box display="flex" flexDir="column" justifyContent="flex-start">
      <Box display="flex" alignItems="center" gap={2}>
        {color && <SmallCircle color={color} />}
        <Text color="gray.600" fontWeight={500} fontSize="xs">
          {label}
        </Text>
      </Box>
      <Heading size="xl">{value}</Heading>
    </Box>
  )
}

export const PoolPerformanceChart = ({ pool }: { pool?: PoolDetails }) => {
  const targetApy = formatPercentage(Object.values(pool?.metadata?.shareClasses || {})[0]?.apyPercentage || 0)

  return (
    <Box
      bg="bg-primary"
      width="100%"
      padding={6}
      borderRadius={10}
      border="1px solid"
      borderColor="border-primary"
      shadow="xs"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="sm">Performance</Heading>
        <Button variant="subtle" type="button">
          <Icon size="sm">
            <GrDownload />
          </Icon>
          Download
        </Button>
      </Flex>
      <Grid gridTemplateColumns="160px 140px 120px" gap={0} mb={12}>
        <LegendItem color="bg-tertiary" label="TVL USDC" value="37,492,485" />
        <LegendItem color="text-highlight" label="Token price" value="1.057" />
        <LegendItem label="Target APY" value={targetApy} />
      </Grid>
      <LineChart data={chartData} />
    </Box>
  )
}
