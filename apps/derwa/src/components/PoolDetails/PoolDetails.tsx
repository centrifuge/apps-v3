import { Card } from '@centrifuge/ui'
import { Grid, GridItem } from '@chakra-ui/react'
import { PoolDetailsOverview } from '@components/PoolDetails/PoolDetailsOverview'
import type { PoolDetails } from '@utils/types'

export function PoolDetails({ pool }: { pool: PoolDetails }) {
  return (
    <>
      <Grid templateColumns={{ base: '1fr', sm: '1fr', md: '1fr', lg: '4fr 6fr' }} gap={10} alignItems="stretch">
        <GridItem>
          <Card header="TVL">data</Card>
        </GridItem>
        <GridItem>
          <PoolDetailsOverview pool={pool} />
        </GridItem>
      </Grid>
    </>
  )
}
