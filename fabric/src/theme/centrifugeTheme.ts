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

export const centrifugeLightTheme: FabricTheme = {
  ...baseTheme,
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