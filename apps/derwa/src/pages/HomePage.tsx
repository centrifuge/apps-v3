import { Spinner } from '@chakra-ui/react'
import { PoolCardsSelect } from '@components/pools/PoolCardsSelect'
import { usePoolsContext } from '@contexts/usePoolsContext'

export default function HomePage() {
  const { pools, setSelectedPoolId, isLoading } = usePoolsContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (isLoading) {
    return <Spinner size="lg" />
  }

  if (!poolIds?.length) return <h3>Sorry, there are no pools available at this time.</h3>

  return <PoolCardsSelect poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
}
