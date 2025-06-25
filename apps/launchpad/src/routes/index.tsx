import { Stack } from '@chakra-ui/react'
import { PoolOverviewTable } from '@components/tokenizations/PoolOverviewTable'

export default function Tokenizations() {
  return (
    <Stack gap={4} mt={4}>
      <PoolOverviewTable />
      <p>aaa</p>
    </Stack>
  )
}
