import { Checkbox, useFormContext } from '@centrifuge/forms'
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
  isDisabled?: boolean
  pricePerShare?: string
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
  const { watch } = useFormContext()
  const watchedOrders = watch('orders')
  const lowestEpoch = useMemo(
    () => Math.min(...items.map((o) => o.epoch).filter((epoch): epoch is number => epoch !== undefined)),
    [items]
  )
  const lowestEpochOrderId = useMemo(() => items.find((o) => o.epoch === lowestEpoch)?.id, [items, lowestEpoch])
  const isLowestSelected = lowestEpochOrderId ? watchedOrders[lowestEpochOrderId]?.isSelected : false

  const { data: holdings } = useHoldings(shareClass)

  const data: TableData[] = useMemo(() => {
    return items.map((item) => ({
      ...item,
      holding: holdings?.find((h) => h.assetId.toString() === item.assetId.toString()),
    }))
  }, [items, holdings])

  const columns: ColumnDefinition<TableData>[] = useMemo(() => {
    return [
      {
        header: 'Approve',
        accessor: 'id',
        render: ({ id, epoch }) => {
          if (!epoch) {
            return <Checkbox name={`orders.${id}.isSelected`} />
          }

          return <Checkbox name={`orders.${id}.isSelected`} disabled={epoch !== lowestEpoch && !isLowestSelected} />
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
  }, [extraColumns, lowestEpoch, isLowestSelected])

  return <DataTable data={data} columns={columns} />
}
