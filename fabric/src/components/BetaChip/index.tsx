import css from '@styled-system/css'
import styled from 'styled-components'
import { Text } from '../Text'
import { FabricTheme } from '../../theme'

export const BetaChip = styled(Text)(
  css({
    display: 'inline-block',
    px: 1,
    bg: 'statusPromote',
    borderRadius: 20,
    fontSize: '10px',
    color: `${(theme: FabricTheme) => theme.colors.textInverted}`,
    whiteSpace: 'nowrap',
    lineHeight: '15px',
  })
)
BetaChip.defaultProps = {
  children: 'Beta',
}
