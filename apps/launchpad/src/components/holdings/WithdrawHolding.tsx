import { Balance } from '@centrifuge/sdk'
import { Holdings, useBalances, useHoldings, usePortfolio } from '@centrifuge/shared'
import { Loader, Text } from '@chakra-ui/react'
import { HoldingsForm } from '@components/holdings/HoldingsForm'
import { usePoolProvider } from '@contexts/PoolProvider'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { useMemo } from 'react'

export default function WithdrawHolding({
  openModal,
  setOpenModal,
  selectedHolding,
}: {
  openModal: { withdraw: boolean; deposit: boolean }
  setOpenModal: (openModal: { withdraw: boolean; deposit: boolean }) => void
  selectedHolding: Holdings[number] | undefined
}) {
  const { shareClass } = useSelectedPool()
  const { data: balances } = useBalances(shareClass, selectedHolding?.asset.chainId, {
    enabled: !!shareClass && !!selectedHolding?.asset.chainId,
  })

  const availableBalance = useMemo(() => {
    return (
      balances?.find((b) => b.assetId.toString() === selectedHolding?.assetId.toString())?.amount ?? new Balance(0, 0)
    )
  }, [balances, selectedHolding])

  if (!selectedHolding) return null

  return (
    <HoldingsForm
      isWithdraw
      selectedHolding={selectedHolding}
      availableBalance={availableBalance}
      openModal={openModal}
      setOpenModal={setOpenModal}
    />
  )
}
