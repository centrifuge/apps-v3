import { baseTheme } from './tokens/baseTheme'
import { blueScale, grayScale, yellowScale } from './tokens/colors'
import { colorTheme } from './tokens/theme'
import { FabricTheme } from './types'

export const exampleOtherTheme: FabricTheme = {
  ...baseTheme,
  scheme: 'dark',
  colors: {
    ...colorTheme.colors,
    accentPrimary: '#d3fbfc',
    accentSecondary: '#d3fbfc',
    primarySelectedBackground: yellowScale[500],
    secondarySelectedBackground: yellowScale[50],
    focus: grayScale[600],
    borderFocus: grayScale[500],
    borderSelected: grayScale[500],
    textSelected: yellowScale[500],
    textInteractive: grayScale[500],
    textInteractiveHover: grayScale[500],
    accentScale: yellowScale,
    blueScale,
    yellowScale,
    grayScale,
    backgroundPlaceholder: colorTheme.colors.backgroundSecondary,
    backgroundPage: 'rgb(42 111 56)',
    backgroundInput: colorTheme.colors.backgroundInverted,

    textPrimary: '#d3fbfc',
    textSecondary: '#d3fbfc',
    textInverted: '#d3fbfc',
    backgroundSecondary: '#0b0d56',
  }
}