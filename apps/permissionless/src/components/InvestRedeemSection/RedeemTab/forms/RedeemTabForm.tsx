import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Balance, PoolNetwork, Vault } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { RedeemCancel } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemCancel'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'
import { RedeemTxCancelled } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTxCancelled'

interface RedeemTabFormProps {
  actionType: RedeemActionType
  isDisabled: boolean
  maxRedeemAmount: string
  networks?: PoolNetwork[]
  parsedRedeemAmount: 0 | Balance
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
          maxRedeemAmount={maxRedeemAmount}
          networks={networks}
          parsedRedeemAmount={parsedRedeemAmount}
          vault={vault}
          vaults={vaults}
          currencies={currencies}
          setCurrencies={setCurrencies}
        />
      )
    case RedeemAction.CANCEL:
      return <RedeemCancel setActionType={setActionType} currencies={currencies} />
    case RedeemAction.SUCCESS:
      return <RedeemTxCancelled currencies={currencies} setActionType={setActionType} />
  }
}
