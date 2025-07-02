import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'

export function Checkbox({ label, onCheckedChange }: { label?: string; onCheckedChange?: (checked: any) => void }) {
  return (
    <ChakraCheckbox.Root variant="outline" size="sm" onCheckedChange={onCheckedChange}>
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control>
        <ChakraCheckbox.Indicator />
      </ChakraCheckbox.Control>
      {label && <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>}
    </ChakraCheckbox.Root>
  )
}
