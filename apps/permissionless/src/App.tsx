import { Box } from '@chakra-ui/react'
import { Header } from './components/Header'
import { PoolPage } from './components/PoolPage'
import { LandingPageSkeleton } from './components/Skeletons/LandingPageSkeleton'
import { useSelectedPoolContext } from './contexts/useSelectedPoolContext'

export function App() {
  const { isLoading } = useSelectedPoolContext()

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
