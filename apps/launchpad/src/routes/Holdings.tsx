import { useHoldings } from '@centrifuge/shared'
import { Text, VStack } from '@chakra-ui/react'
import { HoldingsTable } from '@components/holdings/HoldingsTable'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Loader } from '@centrifuge/ui'

const Holdings = () => {
  const { shareClass, poolCurrency } = useSelectedPool()
  const { data: holdings, isLoading, isIdle } = useHoldings(shareClass)

  if (!isLoading && !isIdle && !holdings?.length) return <VStack>No holdings found</VStack>

  if (isLoading || isIdle) return <Loader />

  if (!shareClass || !poolCurrency) return

  return <HoldingsTable holdings={holdings ?? []} shareClass={shareClass} poolCurrency={poolCurrency} />
}

export default Holdings
