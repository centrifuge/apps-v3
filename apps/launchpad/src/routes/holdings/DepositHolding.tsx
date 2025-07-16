import { useHoldings, usePortfolio } from '@centrifuge/shared'
import { Loader, Text } from '@chakra-ui/react'
import { HoldingsForm } from '@components/holdings/HoldingsForm'
import { usePoolProvider } from '@contexts/PoolProvider'

export default function DepositHolding() {
  const { data: portfolio } = usePortfolio()
  const { shareClass, isLoading: isPoolLoading } = usePoolProvider()
  const { data: holdings, isLoading } = useHoldings(shareClass?.shareClass!)

  if (isPoolLoading || isLoading) return <Loader />

  if (!holdings) return <Text>No holdings found. Add a new holding.</Text>

  return <HoldingsForm portfolio={portfolio} holdings={holdings} />
}
