import { FabricTheme } from '../types'
import { breakpoints } from './breakpoints'
import { space } from './space'
import { typography } from './typography'

export const baseTheme: Omit<FabricTheme, 'colors' | 'scheme' | 'shadows'> = {
  breakpoints,
  typography,
  space,
  sizes: {
    dialog: 564,
    drawer: 461,
    container: 1152,
    iconSmall: 16,
    iconMedium: 24,
    iconRegular: 32,
    iconLarge: 40,
    input: 40,
    mainContent: 1800,
  },
  radii: {
    tooltip: 4,
    card: 8,
    input: 8,
    button: 4,
    chip: 4,
  },
  fonts: {
    standard: 'Inter, sans-serif',
  },
  zIndices: {
    sticky: 10,
    header: 30,
    overlay: 50,
    onTopOfTheWorld: 1000, // use sparingly, only for edge cases
  },
}
