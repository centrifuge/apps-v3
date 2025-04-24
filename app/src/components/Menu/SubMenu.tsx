import { Grid, IconChevronDown, IconChevronRight, Stack, Text, FabricTheme } from '@centrifuge/fabric'
import * as React from 'react'
import { Link } from 'react-router-dom'
import styled, {useTheme} from 'styled-components'
import { StyledRouterButton } from '.'
import { useIsAboveBreakpoint } from '../../utils/useIsAboveBreakpoint'
import { baseButton, primaryButton } from './styles'

export const LIGHT_BACKGROUND = 'rgba(145, 150, 155, 0.13)'

export const Toggle = styled(Text)<{ isActive?: boolean; stacked?: boolean }>`
  ${baseButton}
  ${primaryButton}
  width: 100%;
  grid-template-columns: ${({ stacked, theme }) =>
    stacked ? '1fr' : `${theme.sizes.iconSmall}px 1fr ${theme.sizes.iconSmall}px`};
  color: ${({ theme }) => theme.colors.textInverted};
  border-radius: 4px;
  background-color: ${({ isActive }) => (isActive ? LIGHT_BACKGROUND : 'transparent')};
  font-weight: 400;

  &:hover {
    background-color: rgba(145, 150, 155, 0.13);

    & span {
      color: ${({ theme }) => theme.colors.textGold};
    }

    & svg {
      color: ${({ theme }) => theme.colors.textGold};
    }
  }
`

const RouterButton = styled(Text)`
  padding: 6px;
  margin-left: 28px;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 14px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.standard};
  &:hover {
    color: ${({ theme }) => theme.colors.textGold};
    background-color: rgba(145, 150, 155, 0.13);
  }
`

const onchainVoting = [
  {
    href: 'https://centrifuge.subsquare.io/democracy/referenda',
    label: 'Onchain voting',
  },
  {
    href: 'https://voting.opensquare.io/space/centrifuge',
    label: 'Offchain voting',
  },
  {
    href: 'https://gov.centrifuge.io/',
    label: 'Governance forum',
  },
]

export function ToggleMenu({
  label,
  icon,
  open,
  setOpen,
  links,
}: {
  label: string
  icon: React.ReactNode
  withToggle?: boolean
  open: boolean
  setOpen: (open: boolean) => void
  links: string[]
}) {
  const theme = useTheme() as FabricTheme
  return (
    <>
      <Toggle
        forwardedAs="button"
        variant="interactive1"
        id={`${label}-button`}
        aria-controls={`${label}-menu`}
        aria-label={open ? 'Hide menu' : 'Show menu'}
        onClick={() => setOpen(!open)}
      >
        {icon}
        <Text color={theme.colors.textInverted}>{label}</Text>
        {open ? (
          <IconChevronDown size={['iconMedium', 'iconMedium', 'iconSmall']} />
        ) : (
          <IconChevronRight size={['iconMedium', 'iconMedium', 'iconSmall']} />
        )}
      </Toggle>
      {open && (
        <Grid display="flex" flexDirection="column" mt={1}>
          {links.map((link) => {
            const toLink = onchainVoting.find((l) => l.label === link)?.href
            return ( toLink ? (
            <RouterButton
              as={Link}
              color={theme.colors.textInverted}
              to={toLink}
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              {link}
            </RouterButton>) : null
          )})}
        </Grid>
      )}
    </>
  )
}

export function SubMenu({
  links,
  withToggle = false,
  label,
  icon,
}: {
  links: string[]
  withToggle: boolean
  label: string
  icon: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const isLarge = useIsAboveBreakpoint('L')
  const theme = useTheme() as FabricTheme
  return (
    <>
      <Stack>
        {withToggle ? (
          <ToggleMenu label={label} icon={icon} open={open} setOpen={setOpen} links={links} />
        ) : (
          <>
            {isLarge ? (
              <>
                <StyledRouterButton as={Link} color={theme.colors.textInverted} to={`/${label.toLowerCase()}`}>
                  {icon}
                  <Text color={theme.colors.textInverted} variant="body2" style={{ marginLeft: 8 }}>
                    {label}
                  </Text>
                </StyledRouterButton>
                {links.map((link) => (
                  <RouterButton key={link} as={Link} color={theme.colors.textInverted} to={`/${label.toLowerCase()}/${link.toLowerCase()}`}>
                    {link}
                  </RouterButton>
                ))}
              </>
            ) : (
              <Stack>
                <StyledRouterButton as={Link} color={theme.colors.textInverted} to={`/${label.toLowerCase()}`}>
                  {icon}
                  <Text color={theme.colors.textInverted} variant="body2" style={{ marginLeft: 8 }}>
                    {label}
                  </Text>
                </StyledRouterButton>
                {links.map((link) => (
                  <RouterButton key={link} as={Link} color={theme.colors.textInverted} to={`/${label.toLowerCase()}/${link.toLowerCase()}`}>
                    {link}
                  </RouterButton>
                ))}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </>
  )
}
