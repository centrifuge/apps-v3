import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import { WalletProvider } from '@centrifuge/wallet'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext'
import { CentrifugeProvider } from '@centrifuge/shared'
import { centrifuge, networks } from './centrifuge'
import { TransactionProvider } from './components/Transactions/TransactionProvider'
import { ChakraCentrifugeProvider, ChakraCentrifugeProviderProps } from '@centrifuge/ui'

const config = {
  themeKey: 'light' as ChakraCentrifugeProviderProps['themeKey'],
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CentrifugeProvider client={centrifuge}>
      <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={networks}>
        <ChakraCentrifugeProvider themeKey={config.themeKey}>
          <TransactionProvider>
            <SelectedPoolProvider>
              <Root />
            </SelectedPoolProvider>
          </TransactionProvider>
        </ChakraCentrifugeProvider>
      </WalletProvider>
    </CentrifugeProvider>
  </StrictMode>
)
