import { useAccount } from 'wagmi'
import { Button } from '@chakra-ui/react'
import { useAppKit } from '@reown/appkit/react'
import { truncateAddress } from '../utils/formatting'

export default function WalletButton() {
  const { open } = useAppKit()
  const { isConnected, address } = useAccount()

  const handleConnect = () => {
    open()
  }

  return isConnected && address ? (
    <Button onClick={handleConnect} width={160}>
      {truncateAddress(address)}
    </Button>
  ) : (
    <Button
      onClick={handleConnect}
      backgroundColor="backgroundButtonSecondary"
      variant="solid"
      transition="box-shadow 0.2s ease"
      _hover={{
        boxShadow: 'xl',
      }}
    >
      Connect wallet
    </Button>
  )
}
