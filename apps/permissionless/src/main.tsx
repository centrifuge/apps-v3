import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './centrifuge'
import { DebugFlags } from '@centrifuge/shared/src/components/DebugFlags'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <DebugFlags>
        <Root />
      </DebugFlags>
    </WagmiProvider>
  </StrictMode>
)
