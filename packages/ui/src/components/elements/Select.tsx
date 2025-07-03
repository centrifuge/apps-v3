import { HStack, Portal, Select as ChakraSelect, createListCollection, Button, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'

export const Select = ({
  defaultValue,
  disabled,
  options,
  label,
  onSelect,
}: {
  defaultValue?: string[]
  disabled?: boolean
  options: { value: string; children?: string | number | React.ReactNode; label: string }[]
  label?: string
  onSelect: (value: any) => void
}) => {
  const [value, setValue] = useState<string[]>(defaultValue || [])

  const collection = createListCollection({
    items: options,
  })

  const onValueChange = (value: string[]) => {
    setValue(value)
    onSelect(value)
  }

  return (
    <ChakraSelect.Root
      collection={collection}
      size="sm"
      onValueChange={({ value }) => onValueChange(value)}
      disabled={disabled}
      value={value}
    >
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Label>{label}</ChakraSelect.Label>
      <ChakraSelect.Control>
        <ChakraSelect.Trigger rounded="lg">
          <ChakraSelect.ValueText placeholder="Please select..." />
          <RiArrowDownSLine />
        </ChakraSelect.Trigger>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content minW="32">
            {options.map((option) => (
              <ChakraSelect.Item item={option} key={option.value}>
                {option.children ?? option.label}
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  )
}
