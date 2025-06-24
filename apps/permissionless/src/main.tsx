import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import { AppKitProvider, config } from '@centrifuge/config'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext'
import { CentrifugeProvider } from '@centrifuge/shared'
import { centrifuge } from './centrifuge'
import { TransactionProvider } from './components/Transactions/TransactionProvider'
import { ChakraCentrifugeProvider } from '@centrifuge/ui'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CentrifugeProvider client={centrifuge}>
      <AppKitProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} centrifugeConfig={centrifuge}>
        <ChakraCentrifugeProvider config={config}>
          <TransactionProvider>
            <SelectedPoolProvider>
              <Root />
            </SelectedPoolProvider>
          </TransactionProvider>
        </ChakraCentrifugeProvider>
      </AppKitProvider>
    </CentrifugeProvider>
  </StrictMode>
)
