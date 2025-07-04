import { useAccount } from 'wagmi'
import { useDebugFlags } from '../components/DebugFlags'

const useAddress = () => {
  const { address: debugAddress } = useDebugFlags()
  const { address } = useAccount()

  return {
    address: debugAddress || address,
  }
}

export { useAddress }
