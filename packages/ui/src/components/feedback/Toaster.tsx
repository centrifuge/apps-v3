import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
  max: 3,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast: any) => {
          // Since our toaster.create() method cannot pass a hash property directly, we need to extract it from the description.
          const hashPrefix = 'hash:'
          const descriptionLines = toast.description?.split('\n')
          const description = descriptionLines?.[0] || ''
          let txHash = ''

          descriptionLines?.forEach((line: string) => {
            if (line.includes(hashPrefix)) {
              txHash = line.substring(line.indexOf(hashPrefix) + hashPrefix.length).trim()
            }
          })

          return (
            <Toast.Root width={{ md: 'sm' }}>
              {toast.type === 'loading' ? <Spinner size="sm" color="black.solid" /> : <Toast.Indicator />}
              <Stack gap="1" flex="1" maxWidth="100%">
                {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                {toast.description && (
                  <Toast.Description wordBreak="break-word">
                    {description}
                    {txHash && (
                      <p>
                        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                          Hash: {txHash}
                        </a>
                      </p>
                    )}
                  </Toast.Description>
                )}
              </Stack>
              {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
              {toast.closable && <Toast.CloseTrigger />}
            </Toast.Root>
          )
        }}
      </ChakraToaster>
    </Portal>
  )
}
