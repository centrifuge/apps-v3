import { HStack, Portal, Select as ChakraSelect, createListCollection, Button } from '@chakra-ui/react'
import { RiArrowDownSLine } from 'react-icons/ri'

export const Select = ({ options }: { options: { value: string; children: React.ReactNode }[] }) => {
  const collection = createListCollection({
    items: options,
  })
  return (
    <ChakraSelect.Root collection={collection} size="sm">
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText placeholder="Please select..." />
          <RiArrowDownSLine />
        </ChakraSelect.Trigger>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content minW="32">
            {options.map((option) => (
              <ChakraSelect.Item item={option} key={option.value}>
                <HStack>{option.children}</HStack>
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  )
}
