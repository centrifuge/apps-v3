import { useHoldings, usePortfolio } from '@centrifuge/shared'
import { Loader, Text } from '@chakra-ui/react'
import { HoldingsForm } from '@components/holdings/HoldingsForm'
import { usePoolProvider } from '@contexts/PoolProvider'

export default function WithdrawHolding() {
  const { data: portfolio, isLoading: isPortfolioLoading } = usePortfolio()
  const { shareClass, isLoading: isPoolLoading } = usePoolProvider()
  const { data: holdings, isLoading } = useHoldings(shareClass?.shareClass!)

  if (isPoolLoading || isLoading || isPortfolioLoading) return <Loader />

  if (!holdings) return <Text>No holdings found. Add a new holding in order to withdraw.</Text>

  return <HoldingsForm isWithdraw portfolio={portfolio} holdings={holdings} />
}
