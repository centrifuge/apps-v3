import { useCallback, useEffect, useMemo } from 'react'
import { useFormContext } from '@centrifuge/forms'
import { useHoldings, usePendingAmounts, networkToName } from '@centrifuge/shared'
import { Price, ShareClass } from '@centrifuge/sdk'
import { Card, DataTable, Loader, NetworkIcon } from '@centrifuge/ui'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'
import { OrderMode } from './modeConfig'
import { Row, tableColumnsConfig } from './tableColumnsConfig'
import { tableDataConfig } from './tableDataConfig'

export const InternalOrdersTable = ({
  mode,
  shareClass,
  pricePerShare,
  shareClassSymbol,
}: {
  mode: OrderMode
  shareClass: ShareClass
  pricePerShare: Price
  shareClassSymbol: string
}) => {
  const { poolDetails } = usePoolProvider()
  const { data: pendingAmounts, isLoading: isPendingAmountsLoading } = usePendingAmounts(shareClass)
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass)
  const { setValue, watch, getValues } = useFormContext()
  const selectedAssets = watch('selectedAssets')
  const poolCurrency = poolDetails?.currency

  const dataConfig = tableDataConfig[mode]
  const columnConfig = tableColumnsConfig[mode]

  const reshapedData = useMemo(() => {
    if (!pendingAmounts || !holdings) return {}
    return pendingAmounts.reduce<Record<number, Row[]>>((acc, item, index) => {
      const holding = holdings.find((h) => h.assetId.equals(item.assetId) && h.asset.chainId === item.chainId)
      const newItems = dataConfig.getRows(item, holding?.asset, index)
      if (newItems.length > 0) {
        acc[item.chainId] = [...(acc[item.chainId] || []), ...newItems]
      }
      return acc
    }, {})
  }, [pendingAmounts, holdings, dataConfig])

  const data = useMemo(() => Object.values(reshapedData).flat(), [reshapedData, pendingAmounts])

  const createFormRow = useCallback(
    (row: Row) => {
      return dataConfig.createFormRow(row, pricePerShare)
    },
    [dataConfig, pricePerShare]
  )

  const handleCheckboxChange = useCallback(
    (checked: boolean, row: Row) => {
      const current = getValues('selectedAssets') || []

      if (!checked) {
        setValue(
          'selectedAssets',
          current.filter((a: any) => a.uniqueId !== row.id),
          { shouldValidate: true }
        )
      } else {
        const newItem = createFormRow(row)
        setValue('selectedAssets', [...current, newItem], { shouldValidate: true })
      }
    },
    [getValues, setValue, createFormRow]
  )

  useEffect(() => {
    const current = getValues('selectedAssets') || []
    if (data.length > 0 && current.length === 0) {
      const initialFormState = data.map(createFormRow)
      setValue('selectedAssets', initialFormState, { shouldValidate: true })
    }
  }, [data, createFormRow, getValues, setValue])

  const columns = useMemo(() => {
    if (!columnConfig) return []
    return columnConfig.getColumns({
      isChecked: (row: Row) => selectedAssets.some((a: any) => a.uniqueId === row.id),
      handleCheckboxChange,
      selectedAssets,
      setValue,
      pricePerShare,
      poolCurrency,
      shareClassSymbol,
    })
  }, [selectedAssets, columnConfig, handleCheckboxChange, pricePerShare, setValue, poolCurrency])

  if (isPendingAmountsLoading || isHoldingsLoading) {
    return <Loader />
  }
  if (!data.length) {
    return <Text mt={4}>No pending orders found.</Text>
  }

  return (
    <>
      {Object.keys(reshapedData).map((chain) => {
        const chainIdNum = Number(chain)
        const tableData = data.filter((row) => Number(row.chainId) === chainIdNum)
        if (!tableData.length) return null

        return (
          <Card key={chain} mt={4}>
            <Flex gap={2} alignItems="center" mb={4}>
              <NetworkIcon networkId={chainIdNum} />
              <Heading size="sm">{networkToName(chainIdNum)}</Heading>
            </Flex>
            {/* @ts-expect-error - TODO: fix this */}
            <DataTable data={tableData} columns={columns} />
          </Card>
        )
      })}
    </>
  )
}
