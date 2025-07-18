import { usePools } from '@centrifuge/shared'
import { PoolSelector } from '@components/PoolSelector'

export default function Home() {
  const { data: pools } = usePools()
  const poolIds = pools?.map((p) => p.id).filter((id) => !!id) ?? []
  return <PoolSelector poolIds={poolIds} />
}
