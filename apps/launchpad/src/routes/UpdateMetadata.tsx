import { PoolMetadata } from '@centrifuge/sdk'
import { mockMetadata, useCentrifugeTransaction } from '@centrifuge/shared'
import { Box, Button } from '@chakra-ui/react'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'

export default function UpdateMetadata() {
  const { execute, isPending } = useCentrifugeTransaction()
  const { pool } = useSelectedPool()

  const handleUpdateMetadata = () => {
    if (!pool) return
    execute(pool.updateMetadata(mockMetadata as unknown as PoolMetadata))
  }

  return (
    <Box mt={8} mb={8}>
      <Button onClick={handleUpdateMetadata} loading={isPending} size="sm">
        Update Metadata for pool {pool?.id.toString()}
      </Button>
    </Box>
  )
}
