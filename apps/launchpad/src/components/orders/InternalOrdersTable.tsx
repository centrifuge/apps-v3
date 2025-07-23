import { useCallback, useEffect, useMemo } from 'react'
import { useFormContext, BalanceInput, Checkbox } from '@centrifuge/forms'
import { Asset, formatDate, formatUIBalance, networkToName, useHoldings, usePendingAmounts } from '@centrifuge/shared'
import { AssetId, Balance, Price, ShareClass } from '@centrifuge/sdk'
import { Card, DataTable, Loader, NetworkIcon, AssetIconText, AssetSymbol } from '@centrifuge/ui'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { usePoolProvider } from '@contexts/PoolProvider'

type OrderMode = 'approve' | 'issue'

type Row = {
  id: string
  chainId: string
  amount: Balance
  asset?: Asset
  assetId: AssetId
  approvedAt?: Date
  epoch?: number
}

export const InternalOrdersTable = ({
  mode,
  shareClass,
  pricePerShare,
}: {
  mode: OrderMode
  shareClass: ShareClass
  pricePerShare: Price
}) => {
  const { poolDetails } = usePoolProvider()
  const { data: pendingAmounts, isLoading: isPendingAmountsLoading } = usePendingAmounts(shareClass)
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass)

  const poolDecimals = poolDetails?.currency.decimals

  const { setValue, watch, getValues } = useFormContext<{
    selectedAssets: Array<{
      uniqueId: string
      assetId: AssetId
      approveAssetAmount?: string
      issuePricePerShare?: string
      assetDecimals?: number
    }>
  }>()

  const selectedAssets = watch('selectedAssets')

  const reshapedData = useMemo(() => {
    if (!pendingAmounts || !holdings) return {}
    return pendingAmounts.reduce<Record<number, Row[]>>((acc, item, idx) => {
      const holding = holdings.find((h) => h.assetId.equals(item.assetId) && h.asset.chainId === item.chainId)
      let newItems: Row[] = []

      if (mode === 'approve' && item.pendingDeposit && !item.pendingDeposit.isZero()) {
        newItems.push({
          id: `${item.chainId}-${item.assetId.toString()}-${idx}`,
          chainId: item.chainId.toString(),
          amount: item.pendingDeposit,
          asset: holding?.asset,
          assetId: item.assetId,
        })
      } else if (mode === 'issue') {
        newItems = item.pendingIssuances.map((issuance) => ({
          id: `${item.chainId}-${issuance.epoch}-${idx}`,
          chainId: item.chainId.toString(),
          amount: issuance.amount,
          approvedAt: issuance.approvedAt,
          epoch: issuance.epoch,
          asset: holding?.asset,
          assetId: item.assetId,
        }))
      }

      if (newItems.length > 0) {
        acc[item.chainId] = [...(acc[item.chainId] || []), ...newItems]
      }
      return acc
    }, {})
  }, [pendingAmounts, holdings, mode])

  const data = useMemo(() => Object.values(reshapedData).flat(), [reshapedData])

  useEffect(() => {
    const current = getValues('selectedAssets') || []
    if (data.length > 0 && current.length === 0) {
      const initialFormState = data.map((row) =>
        mode === 'issue'
          ? {
              uniqueId: row.id,
              assetId: row.assetId,
              issuePricePerShare: pricePerShare.toFloat().toString(),
            }
          : {
              uniqueId: row.id,
              assetId: row.assetId,
              approveAssetAmount: row.amount.toFloat().toString(),
              assetDecimals: row.asset?.decimals,
            }
      )
      setValue('selectedAssets', initialFormState, {
        shouldValidate: true,
      })
    }
  }, [data, mode, pricePerShare])

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
        const newItem =
          mode === 'issue'
            ? {
                uniqueId: row.id,
                assetId: row.assetId,
                issuePricePerShare: pricePerShare.toFloat().toString(),
              }
            : {
                uniqueId: row.id,
                assetId: row.assetId,
                approveAssetAmount: row.amount.toFloat().toString(),
                assetDecimals: row.asset?.decimals,
              }

        setValue('selectedAssets', [...current, newItem], { shouldValidate: true })
      }
    },
    [getValues, setValue, mode, pricePerShare]
  )

  const columns = useMemo(() => {
    const isChecked = (row: Row) => selectedAssets.some((a) => a.uniqueId === row.id)

    const baseColumns = [
      {
        header: 'Amount',
        accessor: 'amount',
        render: (row: Row) => (
          <Text>
            {formatUIBalance(row.amount, {
              tokenDecimals: row.asset?.decimals,
              currency: row.asset?.symbol,
            })}
          </Text>
        ),
      },
      {
        header: 'Currency',
        accessor: 'currency',
        render: (row: Row) => <AssetIconText assetSymbol={row.asset?.symbol as AssetSymbol} boxSize="20px" />,
      },
    ]

    const sharedCheckboxColumn = {
      render: (row: Row) => (
        <Checkbox name="" checked={isChecked(row)} onChange={(e) => handleCheckboxChange(e, row)} />
      ),
    }

    if (mode === 'approve') {
      return [
        { header: 'Approve', accessor: 'id', ...sharedCheckboxColumn, width: '60px' },
        ...baseColumns,
        {
          header: 'Approve Amount',
          accessor: 'approveAmount',
          render: (row: Row) => {
            const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
            return (
              <BalanceInput
                name={`selectedAssets.${idx}.approveAssetAmount`}
                buttonLabel="Max"
                decimals={row.asset?.decimals}
                onButtonClick={() => {
                  setValue(`selectedAssets.${idx}.approveAssetAmount`, row.amount.toFloat().toString())
                }}
              />
            )
          },
        },
      ]
    }

    return [
      { header: 'Issue', accessor: 'id', ...sharedCheckboxColumn },
      ...baseColumns,
      {
        header: 'Approved At',
        accessor: 'approvedAt',
        render: (row: Row) => <Text>{formatDate(row.approvedAt ?? new Date(), 'short', true)}</Text>,
      },
      {
        header: 'Issue with NAV per share',
        accessor: 'issuePricePerShare',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          return (
            <BalanceInput
              name={`selectedAssets.${idx}.issuePricePerShare`}
              disabled={idx === -1}
              buttonLabel="Latest"
              onButtonClick={() => {
                setValue(`selectedAssets.${idx}.issuePricePerShare`, pricePerShare.toFloat().toString())
              }}
              currency={poolDetails?.currency.symbol}
              decimals={poolDecimals}
            />
          )
        },
      },
      {
        header: 'Issue new shares',
        accessor: 'newShares',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          if (idx === -1) return <Text>-</Text>
          const issuePrice = new Price(selectedAssets[idx].issuePricePerShare ?? 0)
          const newShares = issuePrice.mul(row.amount)
          return <Text>{formatUIBalance(newShares, { precision: 2 })}</Text>
        },
      },
    ]
  }, [selectedAssets, mode, handleCheckboxChange, pricePerShare, setValue])

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
            {/* @ts-ignore */}
            <DataTable data={tableData} columns={columns} />
          </Card>
        )
      })}
    </>
  )
}
