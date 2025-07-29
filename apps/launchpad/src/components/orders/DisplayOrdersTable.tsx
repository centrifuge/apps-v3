import { Balance } from '@centrifuge/sdk'
import { formatDate, formatUIBalance, networkToName } from '@centrifuge/shared'
import { DataTable, ColumnDefinition, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useMemo } from 'react'

type Order = {
  chainId: number
  pendingDeposit?: Balance
  pendingRedeem?: Balance
  pendingIssuances?: { amount: Balance; approvedAt: Date }[]
  pendingRevocations?: { amount: Balance; approvedAt: Date }[]
}

type PendingAmount = Order[]

type DataTableRow = {
  id: string | number
  amount: Balance
  network: number
  approvedAt: Date | null
}

type Key = 'pendingDeposit' | 'pendingRedeem' | 'pendingRevocations' | 'pendingIssuances'

export function DisplayOrdersTable({ orders, dataKey }: { orders: PendingAmount; dataKey: Key }) {
  const { poolCurrency } = useSelectedPool()
  const isArray = dataKey === 'pendingRevocations' || dataKey === 'pendingIssuances'

  const columns = useMemo(() => {
    const columnDefinitions: ColumnDefinition<DataTableRow>[] = [
      {
        header: 'Amount',
        accessor: 'amount',
        render: (row) => (
          <Text>
            {formatUIBalance(row.amount, {
              currency: poolCurrency?.symbol ?? 'USD',
              precision: 2,
              tokenDecimals: poolCurrency?.decimals ?? 18,
            })}
          </Text>
        ),
      },
      ...(isArray
        ? [
            {
              header: 'Approved at',
              accessor: 'approvedAt' as keyof DataTableRow,
              render: (row: DataTableRow) => (
                <Text>{row.approvedAt ? formatDate(row.approvedAt, 'short', true) : '-'}</Text>
              ),
            },
          ]
        : []),
      {
        header: 'Network',
        accessor: 'network',
        render: (row) => (
          <Flex alignItems="center" gap={2}>
            <NetworkIcon networkId={row.network} />
            <Text>{networkToName(row.network)}</Text>
          </Flex>
        ),
      },
    ]
    return columnDefinitions
  }, [isArray, poolCurrency])

  const data = useMemo((): DataTableRow[] => {
    if (!isArray) {
      return (orders || []).flatMap((order, index) => {
        const amount = order[dataKey as 'pendingDeposit' | 'pendingRedeem']!
        if (amount && !amount.isZero()) {
          return [
            {
              id: index,
              amount: amount,
              network: order.chainId,
              approvedAt: null,
            },
          ]
        }
        return []
      })
    }

    return (orders || []).flatMap((order, orderIndex) => {
      const value = order[dataKey as 'pendingIssuances' | 'pendingRevocations']
      if (Array.isArray(value)) {
        return value.flatMap((item, itemIndex) => {
          if (item.amount && !item.amount.isZero()) {
            return [
              {
                id: `${orderIndex}-${itemIndex}`,
                amount: item.amount,
                network: order.chainId,
                approvedAt: item.approvedAt,
              },
            ]
          }
          return []
        })
      }
      return []
    })
  }, [orders, dataKey, isArray])

  if (!data.length) {
    return (
      <Box border="1px solid" borderColor="border-primary" borderRadius="lg" p={4}>
        <Text fontSize="sm">No orders to display</Text>
      </Box>
    )
  }

  return <DataTable columns={columns} data={data} />
}
