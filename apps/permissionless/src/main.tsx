import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import { config } from './config'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext'
import { CentrifugeProvider } from '@centrifuge/shared'
import { centrifuge } from './centrifuge'

const chosenThemeConfig = config.themes[config.defaultTheme]
const system = createSystem(defaultConfig, chosenThemeConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CentrifugeProvider client={centrifuge}>
      <ChakraProvider value={system}>
        <SelectedPoolProvider>
          <Root />
        </SelectedPoolProvider>
      </ChakraProvider>
    </CentrifugeProvider>
  </StrictMode>
)
