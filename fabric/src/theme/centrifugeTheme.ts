import { baseTheme } from './tokens/baseTheme'
import { blueScale, grayScale, yellowScale } from './tokens/colors'
import { colorTheme } from './tokens/theme'
import { FabricTheme } from './types'

const centrifugeBlue = '#2762ff'
const altairYellow = '#ffc012'

const brandCentrifuge = {
  accentPrimary: centrifugeBlue,
  accentSecondary: altairYellow,
}

const shadows =  {
  cardInteractive: '1px 3px 6px rgba(0, 0, 0, 0.15)',
  cardActive: ` 0 0 0 1px ${grayScale[600]}, 0 1px 5px rgba(0, 0, 0, 0.2)`,
  cardOverlay: '4px 8px 24px rgba(0, 0, 0, 0.2)',
  buttonPrimary: `0px 0px 0px 3px ${colorTheme.colors.shadowButtonPrimary}`,
  buttonSecondary: `0px 0px 0px 3px ${colorTheme.colors.shadowButtonSecondary}`,
  buttonInverted: `0px 0px 0px 3px ${colorTheme.colors.shadowButtonInverted}`,
}

export const centrifugeLightTheme: FabricTheme = {
  ...baseTheme,
  shadows,
  scheme: 'light',
  colors: {
    ...brandCentrifuge,
    ...colorTheme.colors,
    primarySelectedBackground: yellowScale[500],
    secondarySelectedBackground: yellowScale[50],
    focus: grayScale[600],
    borderFocus: grayScale[500],
    borderSelected: grayScale[500],
    textSelected: grayScale[500],
    textInteractive: grayScale[500],
    textInteractiveHover: grayScale[500],
    accentScale: yellowScale,
    blueScale,
    yellowScale,
    grayScale,
    backgroundPlaceholder: grayScale[100],
  }
}

export const centrifugeDarkTheme: FabricTheme = {
  ...baseTheme,
  shadows,
  scheme: 'dark',
  colors: {
    ...brandCentrifuge,
    ...colorTheme.colors,
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
    backgroundPage: colorTheme.colors.backgroundInverted,
    backgroundInput: colorTheme.colors.backgroundInverted,
    textPrimary: colorTheme.colors.textInverted,
    textSecondary: colorTheme.colors.textPrimary,
    textInverted: colorTheme.colors.textPrimary,
    backgroundSecondary: colorTheme.colors.backgroundInverted,
    backgroundInverted: colorTheme.colors.backgroundSecondary,
  }
}

export const centrifugeTheme = {
  light: centrifugeLightTheme,
  dark: centrifugeDarkTheme,
}

export default centrifugeLightTheme