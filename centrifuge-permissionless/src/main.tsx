import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root.tsx'
import { TransactionProvider } from './components/Transactions/TransactionProvider.tsx'
import { config } from './config.ts'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext.tsx'

const chosenThemeConfig = config.themes[config.defaultTheme]
const system = createSystem(defaultConfig, chosenThemeConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <TransactionProvider>
        <SelectedPoolProvider>
          <Root />
        </SelectedPoolProvider>
      </TransactionProvider>
    </ChakraProvider>
  </StrictMode>
)
