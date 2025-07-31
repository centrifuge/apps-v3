import { Outlet, Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Box, Flex, IconButton, Text, Spacer, Heading, Separator } from '@chakra-ui/react'
import {
  ErrorBoundary,
  IconArrowLeft,
  IconArrowRight,
  IconPlus,
  LinkButton,
  LogoCentrifuge,
  LogoCentrifugeText,
} from '@centrifuge/ui'
import { SidebarTabs } from './SidebarTabs'
import { WalletButton } from '@centrifuge/wallet'
import { usePoolDetails } from '@centrifuge/shared'
import { PoolId } from '@centrifuge/sdk'
import { SelectedPoolProvider } from '@contexts/SelectedPoolProvider'

export const Sidebar = () => {
  const { poolId, shareClassId } = useParams()
  const { data: poolDetails } = usePoolDetails(poolId ? new PoolId(poolId) : undefined, { enabled: !!poolId })
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 20 : 64

  const poolName = useMemo(() => {
    if (!poolDetails) return undefined
    return poolDetails.metadata?.pool.name
  }, [poolDetails])

  const shareClassName = useMemo(() => {
    if (!poolDetails) return undefined
    return poolDetails.shareClasses.find((sc) => sc.shareClass.id.toString() === shareClassId)?.details.symbol
  }, [poolDetails, shareClassId])

  const displayTitle = useMemo(() => {
    if (!poolName) return undefined
    if (shareClassName) return `${poolName} - ${shareClassName}`
    return poolName
  }, [poolName, shareClassName])

  return (
    <Flex>
      <Box as="aside" w={sidebarWidth} bg="gray.800" h="100vh" pos="fixed" transition="width 0.2s" color="white">
        <IconButton
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          size="sm"
          variant="plain"
          pos="absolute"
          top={5}
          right={-2}
          zIndex="overlay"
          color="gray.400"
        >
          {collapsed ? <IconArrowRight /> : <IconArrowLeft />}
        </IconButton>

        <Flex direction="column" h="full" p={4}>
          <Flex h="40px" align="center" justify={collapsed ? 'center' : 'flex-start'} mb={6}>
            {collapsed ? <LogoCentrifuge fill="white" size={26} /> : <LogoCentrifugeText fill="white" size={28} />}
          </Flex>

          <Flex direction="column" gap={4} flex="1">
            <SidebarTabs collapsed={collapsed} />
          </Flex>

          <Box color="gray.500" pt={4} mt={4} alignSelf="center" w="full">
            {collapsed ? (
              <Link to="/pools/create">
                <IconPlus />
              </Link>
            ) : (
              <LinkButton to="/pools/create" bg="gray.700" justifyContent="center" w="full">
                <IconPlus color="white" />
                <Text color="white" ml={2}>
                  Create Pool
                </Text>
              </LinkButton>
            )}
          </Box>
        </Flex>
      </Box>

      <Flex as="main" direction="column" flex="1" ml={sidebarWidth} p={8} transition="margin-left 0.2s">
        <Flex w="full" mb={8} alignItems="center">
          {displayTitle && <Heading>{displayTitle}</Heading>}
          <Spacer />
          <WalletButton colorPalette={['black', 'black']} variant={['solid', 'solid']} />
        </Flex>

        <Separator />

        <Box flex="1" mt={8}>
          <SelectedPoolProvider>
            <Outlet />
          </SelectedPoolProvider>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Sidebar
