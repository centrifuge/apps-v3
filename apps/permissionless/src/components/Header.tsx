import { Box } from '@chakra-ui/react'
import { WalletButton } from '@centrifuge/wallet'
// TODO: we should have a config and should come from it
import { LogoCentrifugeText } from '@centrifuge/ui'
import { PoolSelector } from './PoolSelector'

export function Header() {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box width={40}>
        <LogoCentrifugeText fill="text-primary" />
      </Box>
      <PoolSelector />
      <WalletButton />
    </Box>
  )
}
