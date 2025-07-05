import { Box } from '@chakra-ui/react'
import { useSetCentrifugeSigner } from '@centrifuge/shared'
import { Header } from './components/Header'
import { PoolPage } from './components/PoolPage'
import { LandingPageSkeleton } from './components/Skeletons/LandingPageSkeleton'
import { useSelectedPoolContext } from './contexts/useSelectedPoolContext'

export function App() {
  const { isLoading } = useSelectedPoolContext()
  /**
   * Automatically sets the signer on the Centrifuge SDK instance based on wallet connection status.
   * This hook should be called once in the app, ideally at the top level.
   * It will set the signer when the wallet is connected and clear it when disconnected.
   * This is important to ensure the SDK uses the correct signer for transactions.
   * If we need to use the signer in other parts of the app, we can access
   * it through the Centrifuge SDK instance obtained from `useCentrifuge()
   */
  useSetCentrifugeSigner()

  return (
    <Box bg="bg-secondary" w="100%" minH="100vh">
      <Box maxW={{ base: '95vw', xl: '80vw' }} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
        {isLoading ? (
          <LandingPageSkeleton />
        ) : (
          <>
            <Header />
            <PoolPage />
          </>
        )}
      </Box>
    </Box>
  )
}
