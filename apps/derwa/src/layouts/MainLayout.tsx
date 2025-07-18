import { memo, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { usePools } from '@centrifuge/shared'
import { LogoCentrifugeText } from '@centrifuge/ui'
import { WalletButton } from '@centrifuge/wallet'
import { PoolSelector } from '@components/PoolSelector'

const MainLayout = memo(() => {
  const { data: fetchedPools } = usePools()

  const pools = useMemo(() => fetchedPools, [fetchedPools])
  const poolIds = useMemo(() => pools?.map((p) => p.id).filter((id) => !!id) ?? [], [])

  return (
    <>
      <Box bg="bg-secondary" w="100%" minH="100vh">
        <Box maxW={{ base: '95vw', xl: '80vw' }} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box width={40} mb={8}>
              <LogoCentrifugeText fill="text-primary" />
            </Box>
            <WalletButton />
          </Box>
          <Outlet />
        </Box>
      </Box>

      <PoolSelector poolIds={poolIds} />
    </>
  )
})

export default MainLayout
