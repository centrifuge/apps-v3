import { NetworkIcon, Card, DataTable, AssetIconText, AssetSymbol } from '@centrifuge/ui'
import { Flex, Heading, Loader, Text, VStack } from '@chakra-ui/react'
import {
  Asset,
  formatDate,
  formatUIBalance,
  networkToName,
  PendingIssuance,
  useHoldings,
  usePendingAmounts,
} from '@centrifuge/shared'
import { AssetId, Balance, Price, ShareClass } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { BalanceInput, Checkbox, useFormContext } from '@centrifuge/forms'

type PendingIssuanceWithAsset = PendingIssuance & {
  asset?: Asset
  assetId: AssetId
}

type Row = {
  id: string
  chainId: string
  amount: Balance
  approvedAt: Date
  epoch: number
  asset?: Asset
  assetId: AssetId
}

export default function IssueOrdersTable({
  shareClass,
  navPerShare,
}: {
  shareClass: ShareClass
  navPerShare: Balance
}) {
  const { data: pendingAmounts, isLoading: isPendingAmountsLoading } = usePendingAmounts(shareClass)
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass)

  const { setValue, watch } = useFormContext()
  const [selectedAssets] = watch(['selectedAssets'])

  // We need to have a combo of holding + approved amounts per holding per chain + pending issuances per holding per chain
  const reshapedData = useMemo(() => {
    if (!pendingAmounts || !holdings) return {}
    return pendingAmounts?.reduce<Record<number, PendingIssuanceWithAsset[]>>((acc, item) => {
      const holding = holdings?.find((h) => h.assetId.equals(item.assetId) && h.asset.chainId === item.chainId)
      const newIssuances = item.pendingIssuances.map((issuance) => ({
        ...issuance,
        asset: holding?.asset,
        assetId: item.assetId,
      }))

      const existingIssuances = acc[item.chainId] || []

      acc[item.chainId] = [...existingIssuances, ...newIssuances]

      return acc
    }, {})
  }, [pendingAmounts, holdings])

  const data = useMemo(() => {
    if (!reshapedData) return []
    return Object.keys(reshapedData ?? {})
      .map((chainId) => {
        const data = reshapedData[parseInt(chainId)]
        return data.map((issuance) => ({
          id: `${chainId}-${issuance.epoch}`,
          chainId: chainId,
          amount: issuance.amount,
          approvedAt: issuance.approvedAt,
          epoch: issuance.epoch,
          asset: issuance.asset,
          assetId: issuance.assetId,
          issuePricePerShare: new Price(navPerShare.toFloat().toString()),
          newShares: new Price(0),
        }))
      })
      .flat()
  }, [reshapedData])

  const columns = useMemo(() => {
    return [
      {
        header: 'Issue',
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
                      issuePricePerShare: new Price(navPerShare.toFloat().toString()),
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
        header: 'Approved At',
        accessor: 'approvedAt',
        render: (row: Row) => {
          return <Text>{formatDate(row.approvedAt, 'short')}</Text>
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
        header: 'Issue with NAV per share',
        accessor: 'issuePricePerShare',
        render: (row: Row) => {
          const index = selectedAssets.findIndex((asset: { assetId: AssetId }) => asset.assetId.equals(row.assetId))
          return (
            <BalanceInput
              name={`selectedAssets.${index}.issuePricePerShare`}
              buttonLabel="Latest"
              onButtonClick={() => {
                setValue(`selectedAssets.${index}.issuePricePerShare`, navPerShare.toFloat().toString())
              }}
            />
          )
        },
        width: '120px',
      },
      {
        header: 'Issue new shares',
        accessor: 'newShares',
        render: (row: Row) => {
          const amount = row.amount
          const index = selectedAssets.findIndex((asset: { assetId: AssetId }) => asset.assetId.equals(row.assetId))
          const issuePricePerShare = new Price(selectedAssets[index]?.issuePricePerShare ?? 0)
          const newSharesValue = issuePricePerShare.mul(amount)
          return <Text>{formatUIBalance(newSharesValue, { precision: 2 })}</Text>
        },
        width: '120px',
      },
    ]
  }, [selectedAssets, navPerShare])

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
