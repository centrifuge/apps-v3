import { Loader, Stack } from '@chakra-ui/react'
import { useAddress, usePoolsByManager } from '@centrifuge/shared'
import { PoolOverviewTable } from '@components/tokenizations/PoolOverviewTable'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export default function Tokenizations() {
  const { address } = useAddress()
  const { data: allPools, isLoading } = usePoolsByManager(address)
  const poolIds = allPools?.map((p) => p.id).filter((id) => !!id) ?? []

  if (isLoading) return <Loader />
  return (
    <Stack>
      <PoolOverviewTable poolIds={poolIds} />
    </Stack>
  )
}
