import { BalanceInput, Checkbox } from '@centrifuge/forms'
import { AssetId, Balance, Price } from '@centrifuge/sdk'
import { Asset, formatUIBalance, formatDate } from '@centrifuge/shared'
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
  poolDecimals?: number
}

const baseCheckboxColumn = (
  header: string,
  isChecked: (row: Row) => boolean,
  handleCheckboxChange: (checked: boolean, row: Row) => void
) => ({
  header,
  accessor: 'id',
  render: (row: Row) => (
    <Checkbox name="" checked={isChecked(row)} onChange={(e: any) => handleCheckboxChange(e.target.checked, row)} />
  ),
  width: '80px',
})

const baseAmountColumn = () => ({
  header: 'Amount',
  accessor: 'amount',
  render: (row: Row) => (
    <Text>{formatUIBalance(row.amount, { tokenDecimals: row.asset?.decimals, currency: row.asset?.symbol })}</Text>
  ),
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
    getColumns: ({ isChecked, handleCheckboxChange, selectedAssets, setValue }: GetColumnsArgs) => [
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
              decimals={row.asset?.decimals}
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
    getColumns: ({ isChecked, handleCheckboxChange, selectedAssets, setValue }: GetColumnsArgs) => [
      baseCheckboxColumn('Redeem', isChecked, handleCheckboxChange),
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
              decimals={row.asset?.decimals}
              onButtonClick={() => {
                setValue(`selectedAssets.${idx}.approveAmount`, row.amount.toFloat().toString())
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
      poolDecimals,
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
        header: 'Price per Share',
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
              currency={poolDecimals?.currency.symbol}
              decimals={poolDecimals?.currency.decimals}
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
    getColumns: (args: GetColumnsArgs) => {
      const columns = tableColumnsConfig.issue.getColumns(args)
      columns[0].header = 'Revoke'
      columns[columns.length - 1].header = 'Payout'
      return columns
    },
  },
}
