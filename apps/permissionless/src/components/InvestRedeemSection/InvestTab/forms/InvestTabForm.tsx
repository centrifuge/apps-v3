import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Balance, PoolNetwork, Vault } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { InvestTxFeedback } from '@components/InvestRedeemSection/InvestTab/forms/InvestTxFeedback'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'
import { VaultDetails } from '@utils/types'

interface InvestTabFormProps {
  actionType: InvestActionType
  isDisabled: boolean
  networks?: PoolNetwork[]
  parsedInvestAmount: 0 | Balance
  vaults: Vault[]
  vaultDetails?: VaultDetails
  setActionType: Dispatch<SetStateAction<InvestActionType>>
  setVault: Dispatch<Vault>
}

export function InvestTabForm({
  actionType,
  isDisabled,
  networks,
  parsedInvestAmount,
  vaults,
  vaultDetails,
  setActionType,
  setVault,
}: InvestTabFormProps) {
  const [currencies, setCurrencies] = useState({
    investCurrency: '',
    receiveCurrency: '',
  })

  switch (actionType) {
    case InvestAction.INVEST_AMOUNT:
      return (
        <InvestAmount
          currencies={currencies}
          isDisabled={isDisabled}
          networks={networks}
          parsedInvestAmount={parsedInvestAmount}
          vaults={vaults}
          vaultDetails={vaultDetails}
          setActionType={setActionType}
          setCurrencies={setCurrencies}
          setVault={setVault}
        />
      )
    case InvestAction.INVESTOR_REQUIREMENTS:
      return <InvestRequirements />
    case InvestAction.SUCCESS:
      return <InvestTxFeedback setActionType={setActionType} currencies={currencies} />
  }
}
