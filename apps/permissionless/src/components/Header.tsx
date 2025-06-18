import { Box } from '@chakra-ui/react'
import { config } from '../config'
import WalletButton from './WalletButton'

export function Header() {
  const [_, LogoCentrifugeText] = config.logo
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box width={40}>
        <LogoCentrifugeText fill="textPrimary" />
      </Box>
      {/* <PoolSelector /> */}
      <WalletButton />
    </Box>
  )
}
