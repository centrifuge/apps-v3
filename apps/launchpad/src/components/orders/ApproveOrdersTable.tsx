import { NetworkIcon, Card, DataTable, AssetIconText, AssetSymbol } from '@centrifuge/ui'
import { Flex, Heading, Loader, Text, VStack } from '@chakra-ui/react'
import {
  Asset,
  formatDate,
  formatUIBalance,
  networkToName,
  PendingIssuance,
  useGroupPendingAmountsByChain,
  useHoldings,
  usePendingAmounts,
} from '@centrifuge/shared'
import { AssetId, Balance, Price, ShareClass } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { BalanceInput, Checkbox, useFormContext } from '@centrifuge/forms'

type Row = {
  id: string
  chainId: string
  amount: Balance
  asset?: Asset
  assetId: AssetId
}

export default function ApproveOrdersTable({
  shareClass,
  poolCurrencyDecimals,
}: {
  shareClass: ShareClass
  poolCurrencyDecimals: number | undefined
}) {
  const { data: pendingAmounts, isLoading: isPendingAmountsLoading } = usePendingAmounts(shareClass)
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass)

  const reshapedData = useMemo(() => {
    if (!pendingAmounts || !holdings) return {}

    return pendingAmounts?.reduce<Record<number, any[]>>((acc, item) => {
      if (!item.pendingDeposit || item.pendingDeposit.isZero()) {
        return acc
      }

      const holding = holdings?.find((h) => h.assetId.equals(item.assetId) && h.asset.chainId === item.chainId)

      const newIssuance = {
        amount: item.pendingDeposit,
        asset: holding?.asset,
        assetId: item.assetId,
      }

      const existingIssuances = acc[item.chainId] || []
      acc[item.chainId] = [...existingIssuances, newIssuance]

      return acc
    }, {})
  }, [pendingAmounts, holdings])

  const { setValue, watch } = useFormContext()
  const [selectedAssets] = watch(['selectedAssets'])
  console.log(selectedAssets)

  const data = useMemo(() => {
    if (!reshapedData) return []
    return Object.keys(reshapedData ?? {})
      .map((chainId) => {
        const data = reshapedData[parseInt(chainId)]
        return data.map((issuance) => ({
          id: `${chainId}-${issuance.epoch}`,
          chainId: chainId,
          amount: issuance.amount,
          asset: issuance.asset,
          assetId: issuance.assetId,
        }))
      })
      .flat()
  }, [reshapedData])

  const columns = useMemo(() => {
    return [
      {
        header: 'Approve',
        accessor: 'id',
        render: (row: Row) => {
          return (
            <Checkbox
              name=""
              onChange={(checked) => {
                if (checked) {
                  setValue('selectedAssets', [
                    ...selectedAssets,
                    {
                      assetId: row.assetId,
                      approveAssetAmount: row.amount.toFloat().toString(),
                      assetDecimals: row.asset?.decimals,
                    },
                  ])
                } else {
                  setValue(
                    'selectedAssets',
                    selectedAssets.filter((asset: { assetId: AssetId }) => asset.assetId !== row.assetId)
                  )
                }
              }}
            />
          )
        },
        width: '60px',
      },
      {
        header: 'Amount',
        accessor: 'amount',
        render: (row: Row) => {
          return (
            <Text>
              {formatUIBalance(row.amount, { tokenDecimals: row.asset?.decimals, currency: row.asset?.symbol })}
            </Text>
          )
        },
        width: '100px',
      },
      {
        header: 'Currency',
        accessor: 'currency',
        render: (row: Row) => {
          return <AssetIconText assetSymbol={row.asset?.symbol as AssetSymbol} boxSize="20px" />
        },
        width: '100px',
      },
      {
        header: 'Approve amount',
        accessor: 'approveAmount',
        render: (row: Row) => {
          const index = selectedAssets.findIndex((asset: { assetId: AssetId }) => asset.assetId.equals(row.assetId))
          return (
            <BalanceInput
              name={`selectedAssets.${index}.approveAssetAmount`}
              buttonLabel="Max"
              onButtonClick={() => {
                setValue(`selectedAssets.${index}.approveAssetAmount`, row.amount.toFloat().toString())
              }}
            />
          )
        },
        width: '120px',
      },
      {
        header: 'Approve amount (USD)',
        accessor: 'newShares',
        render: (row: Row) => {
          const index = selectedAssets.findIndex((asset: { assetId: AssetId }) => asset.assetId.equals(row.assetId))
          const approveAmount = selectedAssets[index]?.approveAssetAmount
          return <Text>{formatUIBalance(approveAmount, { tokenDecimals: poolCurrencyDecimals })}</Text>
        },
        width: '120px',
      },
    ]
  }, [selectedAssets, poolCurrencyDecimals])

  if (isPendingAmountsLoading || isHoldingsLoading) {
    return <Loader />
  }

  if (!data?.length) return

  return Object.keys(reshapedData ?? {}).map((chainId) => {
    return (
      <Card mt={4}>
        <Flex gap={2} alignItems="center" mb={4}>
          <NetworkIcon networkId={parseInt(chainId)} />
          <Heading size="sm"> {networkToName(parseInt(chainId))}</Heading>
        </Flex>
        {/* @ts-ignore */}
        <DataTable data={data.filter((item) => parseInt(item.chainId) === parseInt(chainId))} columns={columns} />
      </Card>
    )
  })
}
