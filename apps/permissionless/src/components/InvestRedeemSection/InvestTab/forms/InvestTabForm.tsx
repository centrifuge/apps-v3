import { type Dispatch, type SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { SuccessPanel } from '@components/InvestRedeemSection/components/SuccessPanel'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'

interface InvestTabFormProps {
  actionType: InvestActionType
  parsedAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTabForm({ actionType, parsedAmount, setActionType }: InvestTabFormProps) {
  switch (actionType) {
    case InvestAction.INVEST_AMOUNT:
      return <InvestAmount parsedAmount={parsedAmount} setActionType={setActionType} />
    case InvestAction.INVESTOR_REQUIREMENTS:
      return <InvestRequirements />
    case InvestAction.SUCCESS:
      return <SuccessPanel isInvesting setActionType={setActionType} />
  }
}
