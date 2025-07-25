import { useLocation, Link, useParams } from 'react-router-dom'
import { Tooltip } from '@centrifuge/ui'
import { Flex, Text, VStack, Box, Separator } from '@chakra-ui/react'
import {
  IconChart,
  IconHoldings,
  IconHome,
  IconManager,
  IconPeople,
  IconSettings,
  IconVault,
  IconOrders,
  IconNav,
} from '@centrifuge/ui'
import { TokenSelector } from './TokenSelector'

const routes = [
  { label: 'Overview', icon: IconHome, to: '/', dynamic: false },
  { label: 'Dashboard', icon: IconChart, to: '/account', dynamic: true },
  { label: 'Investors', icon: IconPeople, to: '/investors', dynamic: true },
  { label: 'NAV', icon: IconNav, to: '/nav', dynamic: true },
  { label: 'Orders', icon: IconOrders, to: '/orders', dynamic: true },
  { label: 'Holdings', icon: IconHoldings, to: '/holdings', dynamic: true },
  { label: 'Vaults', icon: IconVault, to: '/vaults', dynamic: true },
  { label: 'Managers', icon: IconManager, to: '/manager', dynamic: true },
  { label: 'Settings', icon: IconSettings, to: '/settings', dynamic: true },
]

const overviewRoute = routes.find((r) => r.to === '/')!
const dynamicRoutes = routes.filter((r) => r.dynamic)

interface SidebarTabsProps {
  collapsed: boolean
}

export const SidebarTabs = ({ collapsed }: SidebarTabsProps) => {
  const { poolId, shareClassId } = useParams<{ poolId?: string; shareClassId?: string }>()
  const location = useLocation()

  const renderRoute = (route: (typeof routes)[0]) => {
    const { label, icon: RouteIcon, to, dynamic } = route

    const path = dynamic && poolId ? `/pool/${poolId}/${shareClassId}${to}` : to

    const isActive = path === '/' ? location.pathname === path : location.pathname.startsWith(path)

    return (
      <Tooltip key={label} content={label} disabled={!collapsed}>
        <Box>
          <Link to={path}>
            <Flex
              align="center"
              p={3}
              borderRadius="lg"
              bg={isActive ? 'gray.700' : 'transparent'}
              color={isActive ? 'yellow.400' : 'gray.400'}
              cursor="pointer"
              _hover={{ bg: 'gray.700' }}
              role="group"
            >
              <RouteIcon size={20} />
              {!collapsed && (
                <Text
                  fontSize="sm"
                  ml={3}
                  fontWeight="medium"
                  color={isActive ? 'yellow.400' : 'white'}
                  _groupHover={{ color: isActive ? 'yellow.400' : 'white' }}
                >
                  {label}
                </Text>
              )}
            </Flex>
          </Link>
        </Box>
      </Tooltip>
    )
  }

  return (
    <VStack gap={2} align="stretch" w="full">
      {renderRoute(overviewRoute)}

      {!collapsed && (
        <VStack align="stretch" py={2} gap={4}>
          <TokenSelector />
          <Separator borderColor="gray.700" />
        </VStack>
      )}

      {poolId && dynamicRoutes.map(renderRoute)}
    </VStack>
  )
}
