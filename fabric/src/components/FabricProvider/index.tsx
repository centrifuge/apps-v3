import { OverlayProvider } from '@react-aria/overlays'
import * as React from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'
import { StyledGlobalStyle } from '../GlobalStyle'

type Props = React.PropsWithChildren<{
  theme: DefaultTheme
}>

export function FabricProvider({ theme, children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <StyledGlobalStyle />
      <OverlayProvider>{children}</OverlayProvider>
    </ThemeProvider>
  )
}
