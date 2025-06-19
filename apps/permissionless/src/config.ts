import { LogoCentrifuge, LogoCentrifugeText } from './components/LogoCentrifuge'
import { colorConfig } from './theme/colorTheme'
import type { createSystem } from '@chakra-ui/react'

export type EnvironmentConfig = {
  name: string
  logo: React.ElementType[]
  logoUrl: string
  themes: Record<string, Parameters<typeof createSystem>[1]>
  defaultTheme: string
  baseCurrency: 'USD'
}

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
