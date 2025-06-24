import React, { ReactNode } from 'react'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

export interface ChakraCentrifugeProviderProps {
  // TODO
  config: any
  children: ReactNode
}

export function ChakraCentrifugeProvider({ config, children }: ChakraCentrifugeProviderProps) {
  const themeKey = config.defaultTheme
  const chosenThemeConfig = config.themes[themeKey]
  const system = createSystem(defaultConfig, chosenThemeConfig)

  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
