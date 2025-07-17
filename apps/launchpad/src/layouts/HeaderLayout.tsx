import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { LogoCentrifugeText } from '@centrifuge/ui'
import { WalletButton } from '@centrifuge/wallet'
import { Box, Container, Stack, Tabs, Button, Heading, IconButton, Text, Flex } from '@chakra-ui/react'
import { Outlet, useLocation, useMatches, useParams, useNavigate } from 'react-router'
import { useMemo } from 'react'
import { IoArrowBackSharp, IoSettingsSharp } from 'react-icons/io5'

interface HeaderLayoutHandle {
  hasSettings?: boolean
  hasTabs?: boolean
}

// Main page tabs
const MAIN_TABS = [
  {
    label: 'Tokenizations',
    path: '/',
  },
  {
    label: 'Investors',
    path: '/investors',
  },
]

// Orders page tabs
const getOrdersTabs = (poolId: string) => [
  {
    label: 'Approve investments',
    path: `/orders/${poolId}/approve`,
  },
  {
    label: 'Issue shares',
    path: `/orders/${poolId}/issue`,
  },
  {
    label: 'Approve Redemptions',
    path: `/orders/${poolId}/approveRedeem`,
  },
  {
    label: 'Revoke shares',
    path: `/orders/${poolId}/revokeRedeem`,
  },
]

// Holdings page tabs
const getHoldingsTabs = (poolId: string) => [
  {
    label: 'Deposit',
    path: `/holdings/${poolId}/deposit`,
  },
  {
    label: 'Withdraw',
    path: `/holdings/${poolId}/withdraw`,
  },
  {
    label: 'Update',
    path: `/holdings/${poolId}/update`,
  },
  {
    label: 'Add',
    path: `/holdings/${poolId}/add`,
  },
]

// Account page tabs
const getAccountTabs = (poolId: string, labels: string[]) => [
  ...labels.map((label) => ({
    label,
    path: `/account/${poolId}/${label}`,
  })),
]

const getPoolSettingsTabs = (poolId: string) => [
  {
    label: 'Pool access',
    path: `/${poolId}/poolAccess`,
  },
  {
    label: 'Pool structure',
    path: `/${poolId}/poolStructure`,
  },
]

function getTabsForRoute(pathname: string, poolId?: string, labels?: string[]) {
  if (pathname.includes('/orders/')) {
    return getOrdersTabs(poolId!)
  }
  if (pathname.startsWith('/account')) {
    return getAccountTabs(poolId!, labels ?? [])
  }
  if (pathname.startsWith('/settings')) {
    return getPoolSettingsTabs(poolId!)
  }
  if (pathname.startsWith('/holdings')) {
    return getHoldingsTabs(poolId!)
  }
  return MAIN_TABS
}

export default function HeaderLayout() {
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const poolId = params.poolId

  // Use page component handle functions for header settings
  const matches = useMatches()
  const currentRoute = matches[matches.length - 1]
  const currentHandle = currentRoute?.handle as HeaderLayoutHandle
  const hasSettings = currentHandle ? currentHandle.hasSettings : true
  const hasTabs = currentHandle ? currentHandle.hasTabs : true

  const memoizedPoolId = useMemo(() => {
    return poolId ? new PoolId(poolId) : undefined
  }, [poolId])

  const { data: poolsDetails } = usePoolDetails(memoizedPoolId!)
  const shareClasses = poolsDetails?.shareClasses.map((shareClass) => shareClass.details.symbol)
  const poolName = poolsDetails?.metadata?.pool?.name ?? 'Pool'

  const tabs = getTabsForRoute(location.pathname, poolId, shareClasses)
  const activeTab = tabs.find((tab) => location.pathname === tab.path)
  const showPoolName = location.pathname !== '/' && location.pathname !== '/investors'

  const handleTabChange = (details: { value: string }) => {
    navigate(details.value)
  }

  return (
    <Stack>
      <Box backgroundColor="text-primary" w="100%">
        <Container maxW="6xl">
          <Stack gap={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <LogoCentrifugeText size={24} fill="white" />
              <WalletButton colorPalette={['gray', 'gray']} variant={['outline', 'outline']} />
            </Flex>

            {showPoolName && (
              <Flex justifyContent={hasSettings ? 'space-between' : ''} alignItems="center" mb={!hasSettings ? 8 : 0}>
                <IconButton onClick={() => navigate(-1)} aria-label="go back" rounded="full">
                  <IoArrowBackSharp />
                </IconButton>
                <Heading
                  size="xl"
                  color="white"
                  width={hasSettings ? 'auto' : '100%'}
                  textAlign={!hasSettings ? 'center' : 'inherit'}
                  mr={!hasSettings ? '110px' : '0'}
                >
                  {poolName}
                </Heading>
                {hasSettings ? (
                  <Button
                    colorPalette="gray"
                    variant="subtle"
                    onClick={() => navigate(`settings/${poolId}/poolAccess`)}
                  >
                    <IoSettingsSharp />
                    <Text>Settings</Text>
                  </Button>
                ) : null}
              </Flex>
            )}

            {hasTabs ? (
              <Tabs.Root
                value={activeTab?.path || tabs[0]?.path}
                onValueChange={handleTabChange}
                colorPalette="yellow"
                maxW="fit-content"
              >
                <Tabs.List>
                  {tabs.map((tab) => (
                    <Tabs.Trigger value={tab.path} color="white" key={tab.path}>
                      {tab.label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>
            ) : null}
          </Stack>
        </Container>
      </Box>

      <Container maxW="6xl" mt={8} mb={8}>
        <Outlet />
      </Container>
    </Stack>
  )
}
