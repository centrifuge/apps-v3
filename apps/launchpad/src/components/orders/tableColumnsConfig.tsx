import { BalanceInput, Checkbox } from '@centrifuge/forms'
import { AssetId, Balance, Price } from '@centrifuge/sdk'
import { Asset, formatUIBalance, formatDate, CurrencyDetails } from '@centrifuge/shared'
import { AssetIconText, AssetSymbol } from '@centrifuge/ui'
import { Text } from '@chakra-ui/react'

export type Row = {
  id: string
  chainId: string
  amount: Balance
  asset?: Asset
  assetId: AssetId
  approvedAt?: Date
  epoch?: number
}

type SelectedAssets = Array<{
  uniqueId: string
  assetId: AssetId
  assetDecimals?: number
  approveAmount?: string
  issuePricePerShare?: string
  redeemAmount?: string
}>

type GetColumnsArgs = {
  isChecked: (row: Row) => boolean
  handleCheckboxChange: (checked: boolean, row: Row) => void
  selectedAssets: SelectedAssets
  setValue: (name: any, value: any, options?: any) => void
  pricePerShare: Price
  poolCurrency?: CurrencyDetails
  shareClassSymbol: string
}

const baseCheckboxColumn = (
  header: string,
  isChecked: (row: Row) => boolean,
  handleCheckboxChange: (checked: boolean, row: Row) => void
) => ({
  header,
  accessor: 'id',
  render: (row: Row) => (
    <Checkbox
      name=""
      checked={isChecked(row)}
      onChange={(checked) => handleCheckboxChange(checked, row)}
      value={row.id}
    />
  ),
  width: '80px',
})

const baseAmountColumn = (poolCurrency?: CurrencyDetails, shareClassSymbol?: string) => ({
  header: 'Amount',
  accessor: 'amount',
  render: (row: Row) => {
    return (
      <Text>
        {formatUIBalance(row.amount, {
          tokenDecimals: poolCurrency?.decimals ?? row.asset?.decimals,
          currency: shareClassSymbol ?? row.asset?.symbol,
        })}
      </Text>
    )
  },
})

const baseCurrencyColumn = () => ({
  header: 'Currency',
  accessor: 'currency',
  render: (row: Row) => <AssetIconText assetSymbol={row.asset?.symbol as AssetSymbol} boxSize="20px" />,
})

export const tableColumnsConfig = {
  // --- APPROVE MODE ---
  approve: {
    getRows: (item: any, holding: Asset) => {
      if (!item.pendingDeposit || item.pendingDeposit.isZero()) return []
      return [
        {
          id: `${item.chainId}-${item.assetId.toString()}`,
          chainId: item.chainId.toString(),
          amount: item.pendingDeposit,
          asset: holding,
          assetId: item.assetId,
        },
      ]
    },
    getColumns: ({ isChecked, handleCheckboxChange, selectedAssets, setValue, poolCurrency }: GetColumnsArgs) => [
      baseCheckboxColumn('Approve', isChecked, handleCheckboxChange),
      baseAmountColumn(),
      baseCurrencyColumn(),
      {
        header: 'Approve Amount',
        accessor: 'approveAmount',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          return (
            <BalanceInput
              name={`selectedAssets.${idx}.approveAmount`}
              disabled={idx === -1}
              buttonLabel="Max"
              decimals={poolCurrency?.decimals}
              onButtonClick={() => {
                setValue(`selectedAssets.${idx}.approveAmount`, row.amount.toFloat().toString())
              }}
            />
          )
        },
      },
    ],
  },

  // --- REDEEM MODE ---
  redeem: {
    getRows: (item: any, holding: Asset) => {
      if (!item.pendingRedeem || item.pendingRedeem.isZero()) return []
      return [
        {
          id: `${item.chainId}-${item.assetId.toString()}`,
          chainId: item.chainId.toString(),
          amount: item.pendingRedeem,
          asset: holding,
          assetId: item.assetId,
        },
      ]
    },
    getColumns: ({
      isChecked,
      handleCheckboxChange,
      selectedAssets,
      setValue,
      poolCurrency,
      shareClassSymbol,
    }: GetColumnsArgs) => [
      baseCheckboxColumn('Redeem', isChecked, handleCheckboxChange),
      baseAmountColumn(poolCurrency, shareClassSymbol),
      baseCurrencyColumn(),
      {
        header: 'Approve Amount',
        accessor: 'approveAmount',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          return (
            <BalanceInput
              name={`selectedAssets.${idx}.approveShareAmount`}
              disabled={idx === -1}
              buttonLabel="Max"
              decimals={poolCurrency?.decimals}
              currency={shareClassSymbol}
              onButtonClick={() => {
                setValue(`selectedAssets.${idx}.approveShareAmount`, row.amount.toFloat().toString())
              }}
            />
          )
        },
      },
    ],
  },

  // --- ISSUE MODE ---
  issue: {
    getRows: (item: any, holding: Asset) => {
      return item.pendingIssuances.map((issuance: any, idx: number) => ({
        id: `${item.chainId}-${issuance.epoch}-${idx}`,
        chainId: item.chainId.toString(),
        amount: issuance.amount,
        approvedAt: issuance.approvedAt,
        epoch: issuance.epoch,
        asset: holding,
        assetId: item.assetId,
      }))
    },
    getColumns: ({
      isChecked,
      handleCheckboxChange,
      selectedAssets,
      setValue,
      pricePerShare,
      poolCurrency,
      shareClassSymbol,
    }: GetColumnsArgs) => [
      baseCheckboxColumn('Issue', isChecked, handleCheckboxChange),
      baseAmountColumn(),
      baseCurrencyColumn(),
      {
        header: 'Approved At',
        accessor: 'approvedAt',
        render: (row: Row) => <Text>{formatDate(row.approvedAt ?? new Date(), 'short', true)}</Text>,
      },
      {
        header: 'Issue with nav per share',
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
              currency={shareClassSymbol}
              decimals={poolCurrency?.decimals}
            />
          )
        },
      },
      {
        header: 'Issue new shares',
        accessor: 'payout',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          if (idx === -1) return <Text>-</Text>
          const issuePrice = new Price(selectedAssets[idx].issuePricePerShare ?? 0)
          const newShares = issuePrice.mul(row.amount)
          return <Text>{formatUIBalance(newShares, { precision: 2 })}</Text>
        },
      },
    ],
  },

  // --- REVOKE MODE ---
  revoke: {
    getRows: (item: any, holding: Asset) => {
      return item.pendingRevocations.map((revocation: any, idx: number) => ({
        id: `${item.chainId}-${revocation.epoch}-${idx}`,
        chainId: item.chainId.toString(),
        amount: revocation.amount,
        approvedAt: revocation.approvedAt,
        epoch: revocation.epoch,
        asset: holding,
        assetId: item.assetId,
      }))
    },
    getColumns: ({
      isChecked,
      handleCheckboxChange,
      selectedAssets,
      setValue,
      pricePerShare,
      poolCurrency,
      shareClassSymbol,
    }: GetColumnsArgs) => [
      baseCheckboxColumn('Revoke', isChecked, handleCheckboxChange),
      baseAmountColumn(poolCurrency, shareClassSymbol),
      baseCurrencyColumn(),
      {
        header: 'Approved At',
        accessor: 'approvedAt',
        render: (row: Row) => <Text>{formatDate(row.approvedAt ?? new Date(), 'short', true)}</Text>,
      },
      {
        header: 'Revoke with price per Share',
        accessor: 'revokePricePerShare',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          return (
            <BalanceInput
              name={`selectedAssets.${idx}.revokePricePerShare`}
              disabled={idx === -1}
              buttonLabel="Latest"
              onButtonClick={() => {
                setValue(`selectedAssets.${idx}.revokePricePerShare`, pricePerShare.toFloat().toString())
              }}
              currency={poolCurrency?.symbol}
              decimals={poolCurrency?.decimals}
            />
          )
        },
      },
      {
        header: 'Issue new shares',
        accessor: 'payout',
        render: (row: Row) => {
          const idx = selectedAssets.findIndex((a) => a.uniqueId === row.id)
          if (idx === -1) return <Text>-</Text>
          const issuePrice = new Price(selectedAssets[idx].issuePricePerShare ?? 0)
          const newShares = issuePrice.mul(row.amount)
          return <Text>{formatUIBalance(newShares, { precision: 2 })}</Text>
        },
      },
    ],
  },
}
