import { Spinner } from '@chakra-ui/react'
import { PoolSelector } from '@components/PoolSelector'
import { usePoolsContext } from '@contexts/usePoolsContext'

export default function HomePage() {
  const { pools, setSelectedPoolId, isLoading } = usePoolsContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (!pools?.length) return null

  if (isLoading) {
    return <Spinner size="lg" />
  }

  return <PoolSelector poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
}
