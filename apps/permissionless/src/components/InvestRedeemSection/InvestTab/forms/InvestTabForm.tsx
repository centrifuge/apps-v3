import { type Dispatch, type SetStateAction } from 'react'
import type { Balance, PoolNetwork, Vault } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { InvestTxFeedback } from '@components/InvestRedeemSection/InvestTab/forms/InvestTxFeedback'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'
import { VaultDetails } from '@utils/types'

interface InvestTabFormProps {
  actionType: InvestActionType
  isDisabled: boolean
  maxInvestAmount: string
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
  maxInvestAmount,
  networks,
  parsedInvestAmount,
  vaults,
  vaultDetails,
  setActionType,
  setVault,
}: InvestTabFormProps) {
  switch (actionType) {
    case InvestAction.INVEST_AMOUNT:
      return (
        <InvestAmount
          isDisabled={isDisabled}
          maxInvestAmount={maxInvestAmount}
          networks={networks}
          parsedInvestAmount={parsedInvestAmount}
          vaults={vaults}
          vaultDetails={vaultDetails}
          setActionType={setActionType}
          setVault={setVault}
        />
      )
    case InvestAction.INVESTOR_REQUIREMENTS:
      return <InvestRequirements />
    case InvestAction.SUCCESS:
      return <InvestTxFeedback vaultDetails={vaultDetails} setActionType={setActionType} />
  }
}
