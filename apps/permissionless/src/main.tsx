import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root.tsx'
import { config, centrifuge } from './config.ts'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext.tsx'
import { CentrifugeProvider } from '@centrifuge/hooks'

const chosenThemeConfig = config.themes[config.defaultTheme]
const system = createSystem(defaultConfig, chosenThemeConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CentrifugeProvider centrifuge={centrifuge}>
      <ChakraProvider value={system}>
        <SelectedPoolProvider>
          <Root />
        </SelectedPoolProvider>
      </ChakraProvider>
    </CentrifugeProvider>
  </StrictMode>
)
