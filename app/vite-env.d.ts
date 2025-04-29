/// <reference types="vite/client" />
import { FabricTheme } from '@centrifuge/fabric'
import {} from 'styled-components'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends FabricTheme {}
}