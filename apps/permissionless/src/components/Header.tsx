import { Box } from '@chakra-ui/react'
import WalletButton from '@components/WalletButton'
import { config } from '../config'

export function Header() {
  const [_, LogoCentrifugeText] = config.logo
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box width={40}>
        <LogoCentrifugeText fill="text-primary" />
      </Box>
      {/* <PoolSelector /> */}
      <WalletButton />
    </Box>
  )
}
