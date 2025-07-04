import { Box, Drawer, IconButton, IconHamburger, IconX } from '@centrifuge/fabric'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router'
import styled from 'styled-components'
import { useIsAboveBreakpoint } from '../../utils/useIsAboveBreakpoint'
import { Footer } from '../Menu/Footer'
import { Menu } from '../Menu'
import { LogoCentrifuge, LogoCentrifugeText } from './LogoCentrifuge'
import { WalletButton as WalletButtonComponent } from './WalletButton'

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.backgroundInverted};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  width: 220px;
`

const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundInverted};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
`

const Content = styled.main`
  padding: 1rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.L}) {
    margin-left: 220px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.L}) and (min-width: ${({ theme }) => theme.breakpoints.M}) {
    margin-left: 0;
    padding-top: 60px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.M}) {
    margin-left: 0;
    padding-top: 60px;
  }
`

const SidebarMenu = () => {
  const isMedium = useIsAboveBreakpoint('M')
  const isLarge = useIsAboveBreakpoint('L')
  return (
    <>
      <Box>
        <Link to="/">
          <Box color="textPrimary" width={[80, 80, 36, 120, 120]}>
            {!isMedium || isLarge ? <LogoCentrifugeText /> : <LogoCentrifuge />}
          </Box>
        </Link>
        <Menu />
      </Box>
      <Footer />
    </>
  )
}

const MobileMenuContent = () => (
  <>
    <Box>
      <Menu />
    </Box>
    <Footer />
  </>
)

export const LayoutBase = () => {
  const location = useLocation()
  const isDesktop = useIsAboveBreakpoint('L')
  const isMedium = useIsAboveBreakpoint('M')

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Close the mobile menu when the location changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <>
      {isDesktop && (
        <Box position="fixed" top="1rem" right="1rem" zIndex={1} mt={2} marginRight={1}>
          <WalletButtonComponent />
        </Box>
      )}

      {!isDesktop && (
        <MobileHeader>
          <Link to="/">
            <LogoCentrifuge />
          </Link>
          <Box display="flex" alignItems="center" marginLeft="auto">
            <WalletButtonComponent />
            <IconButton>
              {mobileMenuOpen ? (
                <IconX
                  color="textInverted"
                  size="iconLarge"
                  onClick={() => {
                    setMobileMenuOpen(false)
                  }}
                />
              ) : (
                <IconHamburger
                  color="textInverted"
                  size="iconLarge"
                  onClick={() => {
                    setMobileMenuOpen(true)
                  }}
                />
              )}
            </IconButton>
          </Box>
        </MobileHeader>
      )}

      {isDesktop && (
        <Sidebar>
          <SidebarMenu />
        </Sidebar>
      )}

      {!isDesktop && (
        <Drawer
          isOpen={mobileMenuOpen}
          onClose={() => null}
          title="Menu"
          backgroundColor="backgroundInverted"
          width={isMedium ? '400px' : '100%'}
          hideIcon
        >
          <MobileMenuContent />
        </Drawer>
      )}

      <Content>
        <Box mx={2}>
          <Outlet />
        </Box>
      </Content>
    </>
  )
}
