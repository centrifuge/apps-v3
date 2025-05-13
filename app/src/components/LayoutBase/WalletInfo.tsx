import { useAccount } from 'wagmi'
import { useDebugFlags } from '../DebugFlags'

export const WalletInfo = () => {
  const { address: accountAddress } = useAccount()
  const { address: debugFlagAddress } = useDebugFlags()
  const address = debugFlagAddress ? debugFlagAddress : accountAddress
  return (
    <>
      {address ?
        <div>Connected address: {address}</div> :
        <appkit-connect-button label="Connect Wallet" />}
      <br />
    </>
  )
}
