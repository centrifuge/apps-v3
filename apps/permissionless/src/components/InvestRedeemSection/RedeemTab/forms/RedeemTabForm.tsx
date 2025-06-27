import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Balance, Vault } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { SuccessPanel } from '@components/InvestRedeemSection/components/SuccessPanel'
import { CancelRedeem } from '@components/InvestRedeemSection/RedeemTab/forms/CancelRedeem'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'

interface RedeemTabFormProps {
  actionType: RedeemActionType
  isDisabled: boolean
  parsedAmount: 0 | Balance
  vault?: Vault
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTabForm({ actionType, isDisabled, parsedAmount, vault, setActionType }: RedeemTabFormProps) {
  const [currencies, setCurrencies] = useState({
    investCurrency: 'deJTRYS',
    receiveCurrency: 'USDC',
  })

  switch (actionType) {
    case RedeemAction.REDEEM_AMOUNT:
      return (
        <RedeemAmount
          isDisabled={isDisabled}
          parsedAmount={parsedAmount}
          vault={vault}
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
