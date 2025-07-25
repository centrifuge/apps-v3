import { useMemo, type Dispatch, type SetStateAction } from 'react'
import { useInvestment } from '@centrifuge/shared'
import type { Balance, PoolNetwork, Vault } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'
import { RedeemTxFeedback } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTxFeedback'
// import { RedeemTxCancelled } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTxCancelled'

interface RedeemTabFormProps {
  actionType: RedeemActionType
  isDisabled: boolean
  maxRedeemAmount: string
  networks?: PoolNetwork[]
  parsedRedeemAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
  vault?: Vault
  vaults?: Vault[]
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTabForm({
  actionType,
  isDisabled,
  maxRedeemAmount,
  networks,
  parsedRedeemAmount,
  parsedReceiveAmount,
  vault,
  vaults,
  setActionType,
}: RedeemTabFormProps) {
  const { data: investment } = useInvestment(vault)
  const redeemCurrencySymbol = investment?.shareCurrency.symbol ?? ''
  const receiveCurrencySymbol = investment?.investmentCurrency.symbol ?? ''

  const currencies = useMemo(
    () => ({
      redeemCurrency: redeemCurrencySymbol,
      receiveCurrency: receiveCurrencySymbol,
    }),
    [redeemCurrencySymbol, receiveCurrencySymbol]
  )

  switch (actionType) {
    case RedeemAction.REDEEM_AMOUNT:
      return (
        <RedeemAmount
          isDisabled={isDisabled}
          maxRedeemAmount={maxRedeemAmount}
          networks={networks}
          parsedRedeemAmount={parsedRedeemAmount}
          vault={vault}
          vaults={vaults}
        />
      )
    case RedeemAction.SUCCESS:
      return (
        <RedeemTxFeedback
          currencies={currencies}
          isDisabled={isDisabled}
          parsedRedeemAmount={parsedRedeemAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          setActionType={setActionType}
        />
      )
    // TODO: add step when adding sync redeem
    // case RedeemAction.CANCEL:
    //   return <RedeemTxCancelled currencies={currencies} setActionType={setActionType} />
  }
}
