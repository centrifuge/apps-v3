import { LogoCentrifuge, LogoCentrifugeText } from '@centrifuge/ui'
import { lightTheme } from '@centrifuge/ui'
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
  // TODO: add logo
  logoUrl: '/',
  themes: {
    light: lightTheme,
  },
  defaultTheme: 'light',
  baseCurrency: 'USD',
}
