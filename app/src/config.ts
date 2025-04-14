import React from 'react'
import { centrifugeTheme } from '@centrifuge/fabric'
import { DefaultTheme } from 'styled-components'
import { LogoCentrifuge, LogoCentrifugeText } from './components/LayoutBase/LogoCentrifuge'

export const lightTheme: DefaultTheme = {
  ...centrifugeTheme,
  sizes: {
    ...centrifugeTheme.sizes,
    mainContent: 1800,
  },
  colors: {
    ...centrifugeTheme.colors,
    placeholderBackground: centrifugeTheme.colors.backgroundSecondary,
  },
  typography: {
    ...centrifugeTheme.typography,
    headingLarge: {
      fontSize: [24, 24, 36],
      lineHeight: 1.25,
      fontWeight: 600,
      color: 'textPrimary',
    },
  },
}

type EnvironmentConfig = {
  name: string
  logo: React.ComponentType<any>[]
  themes: { light: DefaultTheme }
  defaultTheme: 'light' | 'dark'
}


export const isTestEnv =
  (window.location.hostname.endsWith('k-f.dev') && !window.location.hostname.includes('production')) ||
  window.location.hostname === 'localhost'

const CENTRIFUGE: EnvironmentConfig = {
  name: 'Centrifuge App',
  logo: [LogoCentrifuge, LogoCentrifugeText],
  themes: {
    light: lightTheme,
  },
  defaultTheme: 'light'
}

export const config = CENTRIFUGE
