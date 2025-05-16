import { Grid, Shelf, Text } from '@centrifuge/fabric'
import { usePools } from '../hooks/usePools'
import { Spinner } from './Spinner'
import { PoolCard } from './PoolCard'

export function PoolList() {
  const { data: pools, isLoading } = usePools()

  return (
    <Shelf>
      {isLoading ? (
        <Spinner />
      ) : !pools?.length ? (
        <Text variant="heading2" color="textSecondary">
          There are no pools yet
        </Text>
      ) : (
        <Grid gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr']} gap={2}>
          {pools.map((p) => (
            <PoolCard pool={p} />
          ))}
        </Grid>
      )}
    </Shelf>
  )
}
