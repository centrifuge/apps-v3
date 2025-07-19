import { PoolSelector } from '@components/PoolSelector'
import { usePoolsContext } from '@contexts/usePoolsContext'

export default function HomePage() {
  const { pools, setSelectedPoolId } = usePoolsContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (!pools?.length) return null

  return <PoolSelector poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
}
