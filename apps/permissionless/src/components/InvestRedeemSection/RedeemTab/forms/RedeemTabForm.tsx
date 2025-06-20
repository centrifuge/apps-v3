import { type Dispatch, type SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { SuccessPanel } from '@components/InvestRedeemSection/components/SuccessPanel'
import { CancelRedeem } from '@components/InvestRedeemSection/RedeemTab/forms/CancelRedeem'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'

interface RedeemTabFormProps {
  actionType: RedeemActionType
  parsedAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTabForm({ actionType, parsedAmount, setActionType }: RedeemTabFormProps) {
  switch (actionType) {
    case RedeemAction.REDEEM_AMOUNT:
      return <RedeemAmount parsedAmount={parsedAmount} setActionType={setActionType} />
    case RedeemAction.CANCEL:
      return <CancelRedeem setActionType={setActionType} />
    case RedeemAction.SUCCESS:
      return <SuccessPanel setActionType={setActionType} />
  }
}
