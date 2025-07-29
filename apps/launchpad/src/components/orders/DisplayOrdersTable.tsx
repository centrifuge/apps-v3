import { Balance } from '@centrifuge/sdk'
import { formatDate, formatUIBalance, networkToName, PendingAmount } from '@centrifuge/shared'
import { DataTable, NetworkIcon } from '@centrifuge/ui'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useMemo } from 'react'

type Key = 'pendingDeposit' | 'pendingRedeem' | 'pendingRevocations' | 'pendingIssuances'

export function DisplayOrdersTable({ orders, dataKey }: { orders: PendingAmount; dataKey: Key }) {
  const { poolCurrency } = useSelectedPool()
  const isArray = dataKey === 'pendingRevocations' || dataKey === 'pendingIssuances'

  const columns = useMemo(() => {
    return [
      {
        header: 'Amount',
        accessor: 'amount',
        render: ({ amount }: { amount: Balance }) => {
          return (
            <Text>
              {formatUIBalance(amount, {
                currency: poolCurrency?.symbol ?? 'USD',
                precision: 2,
                tokenDecimals: poolCurrency?.decimals ?? 0,
              })}
            </Text>
          )
        },
      },
      ...(isArray
        ? [
            {
              header: 'Approved at',
              accessor: 'approvedAt',
              render: ({ approvedAt }: { approvedAt: Date }) => {
                return <Text>{formatDate(approvedAt, 'short', true)}</Text>
              },
            },
          ]
        : []),
      {
        header: 'Network',
        accessor: 'network',
        render: ({ network }: { network: number }) => {
          return (
            <Flex alignItems="center" gap={2}>
              <NetworkIcon networkId={network} />
              <Text>{networkToName(network)}</Text>
            </Flex>
          )
        },
      },
    ]
  }, [isArray])

  const data = useMemo(() => {
    if (!isArray) {
      return orders.map((order, index) => {
        return {
          id: Number(index),
          amount: order[dataKey as keyof typeof order],
          network: order.chainId,
          approvedAt: null,
        }
      })
    }

    return orders.flatMap((order, orderIndex) => {
      const value = order[dataKey as keyof typeof order]
      if (Array.isArray(value)) {
        return value.map((item: any, itemIndex: number) => ({
          id: Number(`${orderIndex}-${itemIndex}`),
          amount: item.amount,
          network: order.chainId,
          approvedAt: item.approvedAt,
        }))
      }
      return []
    })
  }, [orders, isArray])

  if (!data.length) {
    return (
      <Box border="1px solid" borderColor="border-primary" borderRadius="lg" p={4}>
        <Text fontSize="sm">No pending orders</Text>
      </Box>
    )
  }

  return <DataTable columns={columns} data={data} />
}
