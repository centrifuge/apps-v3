import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Separator } from '@chakra-ui/react'
import { ErrorBoundary, LogoCentrifugeText } from '@centrifuge/ui'
import { WalletButton } from '@centrifuge/wallet'

const MainLayout = memo(() => {
  return (
    <Box bg="bg-secondary" w="100%" minH="100vh">
      <Box maxW={{ base: '95vw', xl: '80vw' }} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box width={40} mb={8}>
            <LogoCentrifugeText fill="text-primary" />
          </Box>
          <WalletButton />
        </Box>
        <Separator mb={4} />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  )
})

export default MainLayout
