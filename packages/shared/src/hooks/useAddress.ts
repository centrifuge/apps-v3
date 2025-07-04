import { useAccount } from 'wagmi'
import { useDeferredValue } from 'react'
import { useDebugFlags } from '../components/DebugFlags'

const useAddress = () => {
  const { address: debugAddress } = useDebugFlags()
  const deferredDebugAddress = useDeferredValue(debugAddress)
  const { address, isConnected, chainId } = useAccount()

  if (deferredDebugAddress) {
    return {
      address: deferredDebugAddress as `0x${string}`,
    }
  }

  return {
    address,
    isConnected,
    chainId,
  }
}

export { useAddress }
