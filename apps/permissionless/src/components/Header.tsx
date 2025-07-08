import { Box } from '@chakra-ui/react'
import { WalletButton } from '@centrifuge/wallet'
import { LogoCentrifugeText } from '@centrifuge/ui'
import { PoolSelector } from './PoolSelector'
import { usePools } from '@centrifuge/shared'

export function Header() {
  const { data: pools } = usePools()
  const poolIds = pools?.map((p) => p.id).filter((id) => !!id) ?? []
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box width={40}>
        <LogoCentrifugeText fill="text-primary" />
      </Box>
      <PoolSelector poolIds={poolIds} />
      <WalletButton />
    </Box>
  )
}
