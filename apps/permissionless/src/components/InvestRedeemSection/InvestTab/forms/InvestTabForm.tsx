import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Balance, Vault } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { InvestTxFeedback } from '@components/InvestRedeemSection/InvestTab/forms/InvestTxFeedback'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'
import { VaultDetails } from '@utils/types'

interface InvestTabFormProps {
  actionType: InvestActionType
  isDisabled: boolean
  parsedAmount: 0 | Balance
  vaultDetails?: VaultDetails
  setActionType: Dispatch<SetStateAction<InvestActionType>>
  setVault: Dispatch<Vault>
  vaults: Vault[]
}

export function InvestTabForm({
  actionType,
  isDisabled,
  parsedAmount,
  vaultDetails,
  setActionType,
  setVault,
  vaults,
}: InvestTabFormProps) {
  const [currencies, setCurrencies] = useState({
    investCurrency: '',
    receiveCurrency: '',
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
          setVault={setVault}
          vaults={vaults}
        />
      )
    case InvestAction.INVESTOR_REQUIREMENTS:
      return <InvestRequirements />
    case InvestAction.SUCCESS:
      return <InvestTxFeedback setActionType={setActionType} currencies={currencies} />
  }
}
