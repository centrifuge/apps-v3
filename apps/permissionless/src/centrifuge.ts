import Centrifuge from '@centrifuge/sdk'

export const centrifuge = new Centrifuge({
  environment: import.meta.env.VITE_CENTRIFUGE_ENV,
})
