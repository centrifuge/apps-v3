import React from 'react'
import { centrifugeTheme, FabricTheme } from '@centrifuge/fabric'
import { LogoCentrifuge, LogoCentrifugeText } from './components/LayoutBase/LogoCentrifuge'

type EnvironmentConfig = {
  name: string
  logo: React.ComponentType[]
  themes: { light: FabricTheme, dark: FabricTheme }
  defaultTheme: 'light' | 'dark',
  baseCurrency: 'USD'
}


export const isTestEnv =
  (window.location.hostname.endsWith('k-f.dev') && !window.location.hostname.includes('production')) ||
  window.location.hostname === 'localhost'

const CENTRIFUGE: EnvironmentConfig = {
  name: 'Centrifuge App',
  logo: [LogoCentrifuge, LogoCentrifugeText],
  themes: {
    light: centrifugeTheme.light,
    dark: centrifugeTheme.dark,
  },
  defaultTheme: 'light',
  baseCurrency: 'USD',
}

export const config = CENTRIFUGE
