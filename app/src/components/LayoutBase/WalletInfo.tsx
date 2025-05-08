import { useAccount } from 'wagmi'

export const WalletInfo = () => {
  const { address } = useAccount()
  return (
    <>
      {address ?
        <div>Connected address: {address}</div> :
        <appkit-connect-button label="Connect Wallet" />}
      <br />
    </>
  )
}
