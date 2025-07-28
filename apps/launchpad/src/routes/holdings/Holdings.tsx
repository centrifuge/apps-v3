import { useHoldings } from '@centrifuge/shared'
import { Text } from '@chakra-ui/react'
import { HoldingsTable } from '@components/holdings/HoldingsTable'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Loader } from '@centrifuge/ui'

const Holdings = () => {
  const { shareClass, poolCurrency } = useSelectedPool()
  const { data: holdings, isLoading, isIdle } = useHoldings(shareClass)

  if (!isLoading && !isIdle && !holdings?.length) return <Text>No holdings found</Text>

  if (!shareClass) return <Text>Share class not found</Text>

  if (!poolCurrency) return <Text>Pool currency not found</Text>

  if (isLoading || isIdle) return <Loader />

  return <HoldingsTable holdings={holdings ?? []} shareClass={shareClass} poolCurrency={poolCurrency} />
}

export default Holdings
