import { createToaster, Toaster as _Toaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top-right',
  max: 3,
  overlap: false,
})

export const Toaster = _Toaster
