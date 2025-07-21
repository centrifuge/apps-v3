import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PoolId } from '@centrifuge/sdk'
import { useAllPoolDetails } from '@centrifuge/shared'
import { Card } from '@centrifuge/ui'
import { routePaths } from '@routes/routePaths'
import { Spinner } from '@chakra-ui/react'

interface PoolSelectorProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export const PoolSelector = ({ poolIds, setSelectedPoolId }: PoolSelectorProps) => {
  const { data: pools, isLoading } = useAllPoolDetails(poolIds)

  const displayPools = useMemo(
    () =>
      pools?.map((pool) => ({
        poolName: pool.metadata?.pool?.name || pool.id.toString(),
        id: pool.id.toString(),
        setId: () => setSelectedPoolId(pool.id),
      })),
    [pools]
  )

  if (isLoading) return <Spinner size="lg" />

  if (!displayPools || pools?.length === 1) return null

  return (
    <>
      {displayPools.map((pool) => (
        <Link to={`${routePaths.poolPage}/${pool.id}`} onClick={pool.setId} key={pool.id}>
          <Card>{pool.poolName}</Card>
        </Link>
      ))}
    </>
  )
}
