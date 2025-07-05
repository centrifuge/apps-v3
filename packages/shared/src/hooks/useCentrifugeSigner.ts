import { useEffect } from 'react'
import { useCentrifuge } from './CentrifugeContext'
import { useWalletClient, useAccount } from 'wagmi'

/**
 * A custom hook to automatically set/clear the signer on the Centrifuge SDK instance
 * based on the current wallet connection status from wagmi.
 */
export function useCentrifugeSigner() {
  const centrifuge = useCentrifuge()
  const { isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (isConnected && walletClient) {
      centrifuge.setSigner(walletClient)
      console.log('Centrifuge signer set for address:', walletClient.account.address)
    } else {
      // If disconnected, clear the signer. This is important to prevent
      // using an old signer if the wallet disconnects.
      centrifuge.setSigner(null)
      console.log('Centrifuge signer cleared (or remains unset due to disconnection).')
    }
  }, [isConnected, walletClient, centrifuge])
}
