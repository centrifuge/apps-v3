import { HStack, Portal, Select as ChakraSelect, createListCollection, Button, Text } from '@chakra-ui/react'
import { RiArrowDownSLine } from 'react-icons/ri'

export const Select = ({
  disabled,
  options,
  label,
  onSelect,
  ...props
}: {
  disabled?: boolean
  options: { value: string; children?: string | number | React.ReactNode; label: string }[]
  label?: string
  onSelect: (value: string[] | number[]) => void
  props?: ChakraSelect.RootProps
}) => {
  const collection = createListCollection({
    items: options,
  })
  return (
    <ChakraSelect.Root
      collection={collection}
      size="sm"
      onValueChange={(e) => onSelect(e.value)}
      disabled={disabled}
      {...props}
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
                <HStack>{option.children ? option.children : <Text>{option.label}</Text>}</HStack>
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  )
}
