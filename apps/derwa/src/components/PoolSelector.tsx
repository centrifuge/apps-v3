import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PoolId } from '@centrifuge/sdk'
import { useAllPoolDetails } from '@centrifuge/shared'
import { Card } from '@centrifuge/ui'

interface PoolSelectorProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export const PoolSelector = ({ poolIds, setSelectedPoolId }: PoolSelectorProps) => {
  const { data: pools } = useAllPoolDetails(poolIds)

  const displayPools = useMemo(
    () =>
      pools?.map((pool) => ({
        poolName: pool.metadata?.pool?.name || pool.id.toString(),
        link: pool.id.raw,
        id: pool.id,
      })),
    [pools]
  )

  if (!displayPools || pools?.length === 1) return null

  return (
    <>
      {displayPools.map((pool) => (
        <Link to={`/pool/${pool.link}`} onClick={() => setSelectedPoolId(pool.id)}>
          <Card>{pool.poolName}</Card>
        </Link>
      ))}
    </>
  )
}
