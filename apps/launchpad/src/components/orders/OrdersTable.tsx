import { Checkbox } from '@centrifuge/forms'
import { formatUIBalance, Holdings, useHoldings } from '@centrifuge/shared'
import { AssetId, ShareClass } from '@centrifuge/sdk'
import { AssetIconText, AssetSymbol, ColumnDefinition, DataTable } from '@centrifuge/ui'
import { useMemo } from 'react'
import { Text } from '@chakra-ui/react'

type Item = {
  chainId: number
  amount: string
  assetId: AssetId
  id: string
  approvedAt?: Date
  epoch?: number
}

export type TableData = Item & {
  holding?: Holdings[number]
}

export const OrdersTable = ({
  items,
  shareClass,
  extraColumns,
}: {
  items: Item[]
  shareClass: ShareClass
  extraColumns?: ColumnDefinition<TableData>[]
}) => {
  const { data: holdings } = useHoldings(shareClass)

  const data: TableData[] = useMemo(() => {
    return items.map((item) => ({
      ...item,
      holding: holdings?.find((h) => h.assetId.toString() === item.assetId.toString()),
    }))
  }, [items, holdings])

  //  @ts-ignore TODO: fix datatable
  const columns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: 'Approve',
        render: ({ id }) => {
          return <Checkbox name={`orders.${id}.isSelected`} />
        },
        width: '40px',
      },
      {
        header: 'Amount',
        accessor: 'amount',
        render: ({ amount }) => <Text>{formatUIBalance(amount)}</Text>,
        width: '100px',
      },
      {
        header: 'Currency',
        accessor: 'holding',
        render: ({ holding }) => <AssetIconText assetSymbol={holding?.asset?.symbol as AssetSymbol} boxSize="18px" />,
        width: '100px',
      },
      ...(extraColumns ?? []),
    ]
  }, [extraColumns])

  // @ts-ignore
  return <DataTable data={data} columns={columns} />
}
