import { Balance, ShareClass } from '@centrifuge/sdk'
import { networkToName, useHoldings, formatBalance } from '@centrifuge/shared'
import { Button, NetworkIcon } from '@centrifuge/ui'
import { DataTable, ColumnDefinition, ActionsDropdown } from '@centrifuge/ui'
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type Row = {
  id: number
  asset: string
  network: string | number
  quantity: string
  price: string
  value: string
  actions?: (row: Row) => React.ReactNode
}

const columns: ColumnDefinition<Row>[] = [
  {
    header: 'Asset',
    accessor: 'asset',
    render: (row: Row) => {
      return <Heading fontSize="xs">{row.asset}</Heading>
    },
    sortKey: 'asset',
    width: '100px',
  },
  {
    header: 'Network',
    accessor: 'network',
    sortKey: 'network',
    render: (row: Row) => {
      return (
        <Flex align="center" gap={2}>
          <NetworkIcon networkId={Number(row.network)} />
          <Heading fontSize="xs">{networkToName(Number(row.network))}</Heading>
        </Flex>
      )
    },
  },
  {
    header: 'Quantity',
    accessor: 'quantity',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.quantity}</Text>
    },
    sortKey: 'quantity',
  },
  {
    header: 'Price',
    accessor: 'price',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.price}</Text>
    },
    sortKey: 'price',
  },
  {
    header: 'Value',
    accessor: 'value',
    render: (row: Row) => {
      return <Text fontSize="xs">{row.value}</Text>
    },
    sortKey: 'value',
  },
]

export function PoolHoldings({ shareClass, poolDecimals }: { shareClass: ShareClass; poolDecimals: number }) {
  const navigate = useNavigate()
  const { poolId } = useParams()
  const holdings = useHoldings(shareClass)
  const { poolDetails } = usePoolProvider()
  const currencySymbol = poolDetails?.currency.symbol ?? 'USD'

  // TODO: Right now we are assuming that 1USD = 1USDC, this needs to be updated in the future
  const totalValue = useMemo(() => {
    return holdings?.data?.reduce(
      (acc, holding) => {
        return acc.add(holding.value)
      },
      new Balance(0, poolDecimals)
    )
  }, [holdings, poolDecimals])

  if (!holdings || !holdings.data || holdings.data.length === 0) {
    return null
  }

  const data: Row[] = holdings?.data?.map((holding, idx) => ({
    id: idx,
    asset: holding.asset.symbol,
    network: holding.asset.chainId,
    quantity: formatBalance(holding.amount),
    price: formatBalance(holding.value.mul(holding.amount)),
    value: formatBalance(holding.value, currencySymbol),
    vaults: [],
    actions: () => {
      return (
        <ActionsDropdown
          items={[
            {
              label: 'deposit',
              element: (
                <Button
                  label="Deposit"
                  onClick={() => navigate(`/holdings/${poolId}/deposit/${holding.assetId}`)}
                  variant="plain"
                  width="100%"
                  height="100%"
                  _hover={{ bg: 'transparent', boxShadow: 'none' }}
                  size="sm"
                />
              ),
            },
            {
              label: 'withdraw',
              element: (
                <Button
                  label="Withdraw"
                  onClick={() => navigate(`/holdings/${poolId}/withdraw/${holding.assetId}`)}
                  variant="plain"
                  width="100%"
                  height="100%"
                  _hover={{ bg: 'transparent', boxShadow: 'none' }}
                  size="sm"
                />
              ),
            },
          ]}
        />
      )
    },
  }))

  return (
    <Stack mt={8} gap={2}>
      <Stack gap={0} mb={4}>
        <Heading size="sm">Holdings</Heading>
        <Flex justify="space-between">
          <Heading size="3xl">{formatBalance(totalValue ?? 0)} USDC</Heading>
          <Flex gap={2}>
            <Button
              label="Add holding"
              onClick={() => navigate(`/holdings/${poolId}/add`)}
              colorPalette="black"
              width="140px"
              size="sm"
            />
            <Button
              label="Vaults"
              onClick={() => navigate(`/vaults/${poolId}`)}
              colorPalette="yellow"
              width="140px"
              size="sm"
            />
          </Flex>
        </Flex>
      </Stack>
      <DataTable data={data} columns={columns} />
    </Stack>
  )
}
