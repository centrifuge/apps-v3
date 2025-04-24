import {
  Box,
  IconDashboard,
  IconGlobe,
  IconGovernance,
  IconInvestments,
  IconNft,
  IconPlus,
  IconSwitch,
  IconWallet,
  Text,
  FabricTheme
} from '@centrifuge/fabric'
import { Link } from 'react-router-dom'
import styled, {useTheme} from 'styled-components'
import { useIsAboveBreakpoint } from '../../utils/useIsAboveBreakpoint'

import { RouterLinkButton } from './RouterLinkButton'
import { SubMenu } from './SubMenu'

const COLOR = '#7C8085'

export const StyledRouterButton = styled(Text)<{ isLarge?: boolean }>`
  display: flex;
  flex-direction: row;
  text-decoration: none;
  align-items: ${({ isLarge }) => (isLarge ? 'center' : 'flex-start')};
  padding: 6px;
  margin: 4px;
  border-radius: 4px;
  &:hover {
    & > div {
      color: ${({ theme }) => theme.colors.textGold};
    }
    & > svg {
      color: ${({ theme }) => theme.colors.textGold};
    }
    background-color: rgba(145, 150, 155, 0.13);
  }
`

const StyledRouterLinkButton = styled(RouterLinkButton)`
  width: 100%;
  margin-top: 12px;
  & > span {
    background-color: ${COLOR};
    border-color: transparent;
    color:${({ theme }) => theme.colors.textInverted}
    margin-bottom: 20px;
    font-size: ${({ theme }) => theme.colors.textGold};

    &:hover {
      box-shadow: 0px 0px 0px 3px #7c8085b3;
      background-color: ${COLOR};
      color:${({ theme }) => theme.colors.textInverted}
    }

    &:active {
      border-color: transparent;
    }
  }
`

export function Menu() {
  const pools = [] // usePoolsThatAnyConnectedAddressHasPermissionsFor() || []
  const showSwaps = false // useFeatureFlags()
  const iconSize = 'iconSmall'
  const isLarge = useIsAboveBreakpoint('L')
  const theme = useTheme() as FabricTheme

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <IconDashboard size={iconSize} color={theme.colors.textInverted} />,
      subMenu: ['Account', 'Assets', 'Investors'],
      enabled: pools.length > 0,
      route: '/dashboard',
      withToggle: false,
    },
    { label: 'Pools', icon: <IconInvestments size={iconSize} color={theme.colors.textInverted} />, route: '/pools', enabled: true },
    { label: 'Portfolio', icon: <IconWallet size={iconSize} color={theme.colors.textInverted} />, route: '/portfolio', enabled: true },
    { label: 'Prime', icon: <IconGlobe size={iconSize} color={theme.colors.textInverted} />, route: '/prime', enabled: true },
    {
      label: 'Governance',
      icon: <IconGovernance size={iconSize} color={theme.colors.textInverted} />,
      subMenu: ['Onchain voting', 'Offchain voting', 'Governance forum'],
      enabled: true,
      withToggle: true,
    },
    {
      label: 'NFTs',
      icon: <IconNft size={iconSize} color={theme.colors.textInverted} />,
      route: '/nfts',
      enabled: false // config.network !== 'centrifuge',
    },
    { label: 'Swaps', icon: <IconSwitch size={iconSize} color={theme.colors.textInverted} />, route: '/swaps', enabled: showSwaps },
  ]

  return (
    <Box width="100%" display="flex" flexDirection="column" mt={isLarge ? 6 : 0}>
      {menuItems.map((item, index) => {
        if (!item.enabled) return null
        return (
          <>
            {item.subMenu ? (
              <SubMenu label={item.label} icon={item.icon} links={item.subMenu} withToggle={item.withToggle} />
            ) : (
              <StyledRouterButton as={Link} key={item.label + index} isLarge={isLarge} to={item.route}>
                {item.icon}
                <Text color={theme.colors.textInverted} variant="body2" style={{ marginLeft: 8 }}>
                  {item.label}
                </Text>
              </StyledRouterButton>
            )}
          </>
        )
      })}
      {pools.length > 0 && <CreatePool />}
    </Box>
  )
}

function CreatePool() {
  return (
    <StyledRouterLinkButton icon={<IconPlus size="iconSmall" />} to="/create-pool" small variant="inverted">
      Create pool
    </StyledRouterLinkButton>
  )
}
