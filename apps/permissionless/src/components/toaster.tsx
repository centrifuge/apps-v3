// This is an auto generated file using Chakra cli
import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
  max: 3,
})

// TODO: fix types
/* eslint-disable */
export const Toaster = () => {
  return (
    <Portal>
      {/* @ts-expect-error property children does not exist on type ChakraToaster */}
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast: any) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? <Spinner size="sm" color="black.solid" /> : <Toast.Indicator />}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
