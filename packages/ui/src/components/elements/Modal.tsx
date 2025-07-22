import { useEffect, useRef } from 'react'
import { Portal, Box, Button, Flex, CloseButton, Separator, Grid } from '@chakra-ui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  primaryActionText?: string
  onPrimaryAction?: () => void
  isPrimaryActionLoading?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  primaryActionText = 'Save Changes',
  onPrimaryAction,
  isPrimaryActionLoading = false,
}: ModalProps) => {
  const contentRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        onClick={onClose}
        zIndex="overlay"
      />

      <Flex position="fixed" top="0" left="0" right="0" bottom="0" align="center" justify="center" zIndex="modal">
        <Box
          ref={contentRef}
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          p={6}
          width={{ base: '90%', md: '500px' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          position="relative"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Box as="h2" fontSize="xl" fontWeight="bold">
              {title}
            </Box>
            <CloseButton onClick={onClose} aria-label="Close modal" variant="plain" marginRight="-40px" />
          </Flex>
          <Separator my={2} color="border-secondary" />

          <Box mb={6}>{children}</Box>

          <Grid gridTemplateColumns="1fr 1fr" gap={2} alignItems="center">
            <Button colorPalette="gray" mr={3} onClick={onClose} variant="solid" size="sm">
              Cancel
            </Button>
            {onPrimaryAction && (
              <Button colorPalette="yellow" onClick={onPrimaryAction} loading={isPrimaryActionLoading} size="sm">
                {primaryActionText}
              </Button>
            )}
          </Grid>
        </Box>
      </Flex>
    </Portal>
  )
}

export default Modal
