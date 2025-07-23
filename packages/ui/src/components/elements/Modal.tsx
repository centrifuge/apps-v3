import React from 'react'
import { Dialog, Portal, CloseButton, Button, Separator, Flex, Box, Grid } from '@chakra-ui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  primaryActionText?: string
  onPrimaryAction?: () => void
  isPrimaryActionLoading?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  primaryActionText = 'Save Changes',
  onPrimaryAction,
  isPrimaryActionLoading = false,
}: ModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            width={{ base: '90%', md: '500px' }}
            position="relative"
          >
            <Dialog.Header display="flex" justifyContent="space-between" alignItems="center">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {title}
              </Dialog.Title>
              <CloseButton aria-label="Close modal" variant="plain" onClick={onClose} marginRight={-12} />
            </Dialog.Header>

            <Separator my={2} />

            <Dialog.Body>{children}</Dialog.Body>

            <Dialog.Footer>
              <Grid w="100%" gap={2} templateColumns={onPrimaryAction ? '1fr 1fr' : '1fr'}>
                <Button size="sm" variant="solid" colorPalette="gray" onClick={onClose}>
                  Cancel
                </Button>
                {onPrimaryAction && (
                  <Button size="sm" colorPalette="yellow" onClick={onPrimaryAction} loading={isPrimaryActionLoading}>
                    {primaryActionText}
                  </Button>
                )}
              </Grid>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
