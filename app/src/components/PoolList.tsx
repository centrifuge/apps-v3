import { Button, Card, Shelf, Stack, Text } from '@centrifuge/fabric'
import type { Pool, ShareClass } from '@centrifuge/sdk'
import { useCentrifugeTransaction } from '../hooks/useCentrifugeTransaction'
import { usePoolDetails, usePools } from '../hooks/usePools'
import { ConnectionGuard } from './ConnectionGuard'
import { Spinner } from './Spinner'

export function PoolList() {
  const { data: pools, isLoading } = usePools()

  return (
    <Shelf p={4} justifyContent="center" textAlign="center">
      {isLoading ? (
        <Spinner />
      ) : !pools?.length ? (
        <Text variant="heading2" color="textSecondary">
          There are no pools yet
        </Text>
      ) : (
        pools.map((p) => <PoolCard pool={p} />)
      )}
    </Shelf>
  )
}

function PoolCard({ pool }: { pool: Pool }) {
  const { data: details } = usePoolDetails(pool.id)

  return (
    <Card>
      <Stack gap={2}>
        <Text variant="heading3">Pool {pool.id.toString()}</Text>
        <Text>Tokens:</Text>
        <Stack gap={2}>
          {details?.shareClasses.map(({ details, shareClass }) => (
            <Shelf gap={2}>
              <Text> {details.name}</Text>
              <Text>{details.symbol}</Text>
              <UpdateTokenPrice shareClass={shareClass} />
            </Shelf>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

function UpdateTokenPrice({ shareClass }: { shareClass: ShareClass }) {
  const { execute, isPending } = useCentrifugeTransaction()
  async function updateTokenPrice() {
    const receipt = await execute(shareClass.notifySharePrice(11155111))
    console.log('transaction success', receipt)
  }
  return (
    <ConnectionGuard>
      <Button onClick={updateTokenPrice} loading={isPending}>
        Update token price
      </Button>
    </ConnectionGuard>
  )
}
