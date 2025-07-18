import { Box } from '@chakra-ui/react'
import { Header } from './components/Header'
import { PoolPage } from './components/PoolPage'
import { LandingPageSkeleton } from './components/Skeletons/LandingPageSkeleton'
import { useSelectedPoolContext } from './contexts/useSelectedPoolContext'
import { ErrorBoundary, useLoadingBoundary } from '@centrifuge/ui'

export function App() {
  const { isLoading } = useSelectedPoolContext()
  // TODO: Move ErrorBoundary to wrap layouts or routes
  const { hideLoading } = useLoadingBoundary()

  return (
    <Box bg="bg-secondary" w="100%" minH="100vh">
      <ErrorBoundary hideLoading={hideLoading}>
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
      </ErrorBoundary>
    </Box>
  )
}
