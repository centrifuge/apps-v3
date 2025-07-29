import { Balance } from '@centrifuge/sdk'
import { Holdings, usePortfolio } from '@centrifuge/shared'
import { HoldingsForm } from '@components/holdings/HoldingsForm'
import { useMemo } from 'react'

export const DepositHolding = ({
  openModal,
  setOpenModal,
  selectedHolding,
}: {
  openModal: { deposit: boolean; withdraw: boolean }
  setOpenModal: (openModal: { deposit: boolean; withdraw: boolean }) => void
  selectedHolding: Holdings[number] | undefined
}) => {
  const { data: portfolio } = usePortfolio()

  const availableBalance = useMemo(() => {
    return portfolio?.find((p) => p.currency.address === selectedHolding?.asset.address)?.balance ?? new Balance(0, 0)
  }, [portfolio, selectedHolding])

  if (!selectedHolding) return null

  return (
    <HoldingsForm
      selectedHolding={selectedHolding}
      availableBalance={availableBalance}
      isWithdraw={false}
      openModal={openModal}
      setOpenModal={setOpenModal}
    />
  )
}
