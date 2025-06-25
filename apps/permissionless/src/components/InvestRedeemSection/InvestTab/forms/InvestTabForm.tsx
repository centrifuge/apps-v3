import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { SuccessPanel } from '@components/InvestRedeemSection/components/SuccessPanel'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'
import { VaultDetails } from '@utils/types'

interface InvestTabFormProps {
  actionType: InvestActionType
  isDisabled: boolean
  parsedAmount: 0 | Balance
  vaultDetails?: VaultDetails
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTabForm({
  actionType,
  isDisabled,
  parsedAmount,
  vaultDetails,
  setActionType,
}: InvestTabFormProps) {
  const [currencies, setCurrencies] = useState({
    investCurrency: 'USDC',
    receiveCurrency: 'deJTRYS',
  })

  switch (actionType) {
    case InvestAction.INVEST_AMOUNT:
      return (
        <InvestAmount
          isDisabled={isDisabled}
          parsedAmount={parsedAmount}
          setActionType={setActionType}
          vaultDetails={vaultDetails}
          currencies={currencies}
          setCurrencies={setCurrencies}
        />
      )
    case InvestAction.INVESTOR_REQUIREMENTS:
      return <InvestRequirements />
    case InvestAction.SUCCESS:
      return <SuccessPanel isInvesting setActionType={setActionType} currencies={currencies} />
  }
}
