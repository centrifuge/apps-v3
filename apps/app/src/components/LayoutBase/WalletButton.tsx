import { useAccount } from 'wagmi'
import { useDebugFlags } from '../DebugFlags'

export const WalletButton = () => {
  const { address: accountAddress } = useAccount()
  const { address: debugFlagAddress } = useDebugFlags()
  const address = debugFlagAddress ? debugFlagAddress : accountAddress
  return address ? <appkit-account-button /> : <appkit-connect-button />
}
