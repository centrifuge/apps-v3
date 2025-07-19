import { Spinner } from '@chakra-ui/react'
import { PoolSelector } from '@components/PoolSelector'
import { usePoolsContext } from '@contexts/usePoolsContext'

export default function HomePage() {
  const { pools, setSelectedPoolId, isLoading } = usePoolsContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (isLoading) {
    return <Spinner size="lg" />
  }

  if (!pools?.length) return null

  return <PoolSelector poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
}
