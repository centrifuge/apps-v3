import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Separator } from '@chakra-ui/react'
import { ErrorBoundary, LogoCentrifugeText } from '@centrifuge/ui'
import { WalletButton } from '@centrifuge/wallet'
// import mainBg from '../assets/main-bg.png'

const MainLayout = memo(() => {
  return (
    <Box bg="bg-secondary" minH="100vh">
      {/* <Box minH="100vh" bgImage={`url(${mainBg})`} bgRepeat="no-repeat" bgSize="cover" backgroundPosition="center"> */}
      <Box maxW={{ base: '95vw', xl: '80vw' }} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
          <Box width={32}>
            <LogoCentrifugeText fill="text-primary" />
          </Box>
          <WalletButton />
        </Box>
        <Separator mb={4} />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      {/* </Box> */}
    </Box>
  )
})

export default MainLayout
