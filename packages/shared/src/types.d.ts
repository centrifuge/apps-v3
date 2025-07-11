/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CENTRIFUGE_ENV: 'testnet' | 'mainnet'
  readonly VITE_REOWN_APP_ID: string
  readonly VITE_ALCHEMY_KEY: string
  readonly VITE_INFURA_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
