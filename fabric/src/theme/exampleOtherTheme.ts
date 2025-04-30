import { baseTheme } from './tokens/baseTheme'
import { blueScale, grayScale, yellowScale } from './tokens/colors'
import { colorTheme } from './tokens/theme'
import { FabricTheme } from './types'


const shadows =  {
  cardInteractive: '1px 3px 6px rgba(0, 0, 0, 0.15)',
  cardActive: ` 0 0 0 1px ${grayScale[600]}, 0 1px 5px rgba(0, 0, 0, 0.2)`,
  cardOverlay: '4px 8px 24px rgba(0, 0, 0, 0.2)',
  buttonPrimary: `0px 0px 0px 3px ${colorTheme.colors.shadowButtonPrimary}`,
  buttonSecondary: `0px 0px 0px 3px ${colorTheme.colors.shadowButtonSecondary}`,
  buttonInverted: `0px 0px 0px 3px ${colorTheme.colors.shadowButtonInverted}`,
}

export const exampleOtherTheme: FabricTheme = {
  ...baseTheme,
  shadows,
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