import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'

export function Checkbox({ label }: { label?: string }) {
  return (
    <ChakraCheckbox.Root variant="outline">
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control>
        <ChakraCheckbox.Indicator />
      </ChakraCheckbox.Control>
      {label && <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>}
    </ChakraCheckbox.Root>
  )
}
