import React from 'react'
import { LogoCentrifuge, LogoCentrifugeText } from './components/LogoCentrifuge'
import { colorConfig } from './theme/colorTheme'
import type { createSystem } from '@chakra-ui/react'
import Centrifuge from '@centrifuge/sdk'

export type EnvironmentConfig = {
  name: string
  logo: React.ElementType[]
  logoUrl: string
  themes: Record<string, Parameters<typeof createSystem>[1]>
  defaultTheme: string
  baseCurrency: 'USD'
}

export const centrifuge = new Centrifuge({
  environment: import.meta.env.VITE_CENTRIFUGE_ENV,
})

export const config: EnvironmentConfig = {
  name: 'Centrifuge App',
  logo: [LogoCentrifuge, LogoCentrifugeText],
  logoUrl: '/assets/centrifuge.svg',
  themes: {
    light: colorConfig,
  },
  defaultTheme: 'light',
  baseCurrency: 'USD',
}
