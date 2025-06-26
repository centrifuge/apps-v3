import { LogoCentrifugeText } from '@centrifuge/ui'
import { WalletButton } from '@centrifuge/wallet'
import { Box, Container, Stack, Tabs } from '@chakra-ui/react'
import { Link, Outlet, useLocation } from 'react-router'

const TABS = [
  {
    label: 'Tokenizations',
    belongsTo: '/',
    path: '/',
  },
  {
    label: 'Investors',
    belongsTo: '/',
    path: '/investors',
  },
]

export default function HeaderLayout() {
  const location = useLocation()
  const tabs = TABS.filter((tab) => location.pathname.startsWith(tab.belongsTo))
  return (
    <Stack>
      <Box backgroundColor="text-primary" w="100%">
        <Container maxW="container.xl">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <LogoCentrifugeText size={24} fill="white" />
            <WalletButton colorPalette={['gray', 'gray']} variant={['outline', 'outline']} />
          </Box>
          <Box>
            <Tabs.Root lazyMount unmountOnExit defaultValue={tabs[0].path} colorPalette="yellow" maxW="fit-content">
              <Tabs.List>
                {tabs.map((tab) => (
                  <Link key={tab.path} to={tab.path}>
                    <Tabs.Trigger value={tab.path} color="white" key={tab.path}>
                      {tab.label}
                    </Tabs.Trigger>
                  </Link>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </Box>
        </Container>
      </Box>
      <Container maxW="container.xl">
        <Outlet />
      </Container>
    </Stack>
  )
}
