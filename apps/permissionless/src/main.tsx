import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import { WalletProvider } from '@centrifuge/wallet'
import { SelectedPoolProvider } from './contexts/useSelectedPoolContext'
import { CentrifugeProvider } from '@centrifuge/shared'
import { centrifuge, networks } from './centrifuge'
import { TransactionProvider } from './components/Transactions/TransactionProvider'
import { ChakraCentrifugeProvider, lightTheme, LogoCentrifuge, LogoCentrifugeText } from '@centrifuge/ui'

// TODO: should be easy to whitelist
const config = {
  themes: {
    light: lightTheme,
  },
  defaultTheme: 'light',
}

console.log('VITE_REOWN_APP_ID:', import.meta.env.VITE_REOWN_APP_ID)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CentrifugeProvider client={centrifuge}>
      <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={networks}>
        <ChakraCentrifugeProvider config={config}>
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
