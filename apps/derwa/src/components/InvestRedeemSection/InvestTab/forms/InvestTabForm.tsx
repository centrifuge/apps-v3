import { type Dispatch, type SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
// import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'
import { InvestTxFeedback } from '@components/InvestRedeemSection/InvestTab/forms/InvestTxFeedback'

interface InvestTabFormProps {
  actionType: InvestActionType
  isDisabled: boolean
  maxInvestAmount: string
  parsedInvestAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTabForm({
  actionType,
  isDisabled,
  maxInvestAmount,
  parsedInvestAmount,
  setActionType,
}: InvestTabFormProps) {
  switch (actionType) {
    case InvestAction.INVEST_AMOUNT:
      return (
        <InvestAmount
          maxInvestAmount={maxInvestAmount}
          parsedInvestAmount={parsedInvestAmount}
          isDisabled={isDisabled}
        />
      )
    // TODO: add this for sync invest form
    // case InvestAction.INVESTOR_REQUIREMENTS:
    //   return <InvestRequirements />
    case InvestAction.CONFIRM:
      return <InvestTxFeedback setActionType={setActionType} />
  }
}
