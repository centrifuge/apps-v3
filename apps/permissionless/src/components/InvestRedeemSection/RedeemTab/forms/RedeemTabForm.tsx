import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Balance, Vault } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { SuccessPanel } from '@components/InvestRedeemSection/components/SuccessPanel'
import { CancelRedeem } from '@components/InvestRedeemSection/RedeemTab/forms/CancelRedeem'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'

interface RedeemTabFormProps {
  actionType: RedeemActionType
  isDisabled: boolean
  parsedRedeemAmount: 0 | Balance
  vault?: Vault
  vaults?: Vault[]
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTabForm({
  actionType,
  isDisabled,
  parsedRedeemAmount,
  vault,
  vaults,
  setActionType,
}: RedeemTabFormProps) {
  const [currencies, setCurrencies] = useState({
    investCurrency: '',
    receiveCurrency: '',
  })

  switch (actionType) {
    case RedeemAction.REDEEM_AMOUNT:
      return (
        <RedeemAmount
          isDisabled={isDisabled}
          parsedRedeemAmount={parsedRedeemAmount}
          vault={vault}
          vaults={vaults}
          currencies={currencies}
          setCurrencies={setCurrencies}
        />
      )
    case RedeemAction.CANCEL:
      return <CancelRedeem setActionType={setActionType} currencies={currencies} />
    case RedeemAction.SUCCESS:
      return <SuccessPanel currencies={currencies} setActionType={setActionType} />
  }
}
