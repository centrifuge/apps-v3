import { Portal, Select as ChakraSelect, createListCollection, Grid } from '@chakra-ui/react'

// non-form select, controlled by the parent

type SelectProps = Omit<ChakraSelect.RootProps, 'collection' | 'defaultValue' | 'value'> & {
  items: { value: string; label: string; children?: React.ReactNode }[]
  label?: string
  placeholder: string
  withIndicator?: boolean
  loading?: boolean
  onSelectionChange?: (value: string) => void
  color?: string
  defaultValue?: string
  value?: string
}

export const Select = ({
  items,
  label,
  placeholder,
  withIndicator = false,
  loading = false,
  onSelectionChange,
  color,
  defaultValue,
  onReset,
  value,
  ...rest
}: SelectProps) => {
  const handleSelectionChange = (details: { value: string[] }) => {
    onSelectionChange?.(details.value[0])
  }

  const collection = createListCollection({
    items,
  })

  return (
    <ChakraSelect.Root
      collection={collection}
      size="sm"
      disabled={loading}
      onValueChange={handleSelectionChange}
      value={value ? [value] : undefined}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      positioning={{ strategy: 'absolute', sameWidth: true, placement: 'top' }}
      {...rest}
    >
      <ChakraSelect.HiddenSelect />
      {label && <ChakraSelect.Label>{label}</ChakraSelect.Label>}
      <ChakraSelect.Control>
        <ChakraSelect.Trigger color={color}>
          <ChakraSelect.ValueText placeholder={placeholder} />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <ChakraSelect.Positioner>
        <ChakraSelect.Content>
          {items.map((item) => (
            <Grid
              templateColumns={withIndicator ? '1fr 20px' : '1fr'}
              border={withIndicator ? '1px solid' : 'none'}
              borderColor={withIndicator ? 'gray.200' : 'transparent'}
              borderRadius={withIndicator ? 'md' : 'none'}
              _hover={{ bg: withIndicator ? 'gray.100' : 'transparent' }}
              mb={withIndicator ? 1 : 0}
              mt={withIndicator ? 1 : 0}
              key={item.value}
            >
              <ChakraSelect.Item
                item={item}
                key={item.value}
                _hover={{ bg: withIndicator ? 'transparent' : 'gray.100' }}
                _selected={{ bg: withIndicator ? 'transparent' : 'gray.100' }}
                _focus={{ bg: withIndicator ? 'transparent' : 'gray.100' }}
                _active={{ bg: withIndicator ? 'transparent' : 'gray.100' }}
              >
                {item.children ?? item.label}
                {withIndicator && <ChakraSelect.ItemIndicator />}
              </ChakraSelect.Item>
            </Grid>
          ))}
        </ChakraSelect.Content>
      </ChakraSelect.Positioner>
    </ChakraSelect.Root>
  )
}
