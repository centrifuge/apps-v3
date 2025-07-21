import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import { createListCollection, Select as ChakraSelect, Field, SelectRootProps, Portal, Group } from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'
import { ReactNode, useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'

export interface CustomSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SelectRootProps, 'collection'> {
  disabled?: boolean
  items: { value: string; children?: ReactNode; label: string }[]
  label: string
  name: FieldPath<TFieldValues>
  rules?: object
  onSelectChange?: (value: unknown) => void
}

export function Select<TFieldValues extends FieldValues = FieldValues>(props: CustomSelectProps<TFieldValues>) {
  const [value, setValue] = useState<string[]>([])
  const { control, trigger } = useFormContext()
  const { name, rules, label, items, disabled, onSelectChange, ...rest } = props

  const {
    field,
    fieldState: { error },
    formState,
  } = useController({
    name,
    control,
    rules,
  })

  const { isError, errorMessage } = useGetFormError<TFieldValues>({
    error,
    name,
  })

  const onValueChange = (value: string[]) => {
    setValue(value)
    field.onChange(value[0])
    trigger(name)
    if (onSelectChange) {
      onSelectChange(field.value)
    }
  }

  const collection = createListCollection({ items })

  return (
    <Group>
      <Field.Root invalid={isError} disabled={formState.isSubmitting} id={name}>
        <Field.Label>{label}</Field.Label>
        <ChakraSelect.Root
          collection={collection}
          size="sm"
          onValueChange={({ value }: { value: string[] }) => onValueChange(value)}
          disabled={disabled}
          value={value}
          background="white"
          borderRadius="md"
          {...rest}
        >
          <ChakraSelect.HiddenSelect />
          <ChakraSelect.Control>
            <ChakraSelect.Trigger {...{ children: true }} style={{ padding: '10px 14px', borderRadius: '8px' }}>
              <ChakraSelect.ValueText {...{ placeholder: 'Please select...' }} />
              <RiArrowDownSLine />
            </ChakraSelect.Trigger>
          </ChakraSelect.Control>
          <Portal>
            <ChakraSelect.Positioner>
              <ChakraSelect.Content>
                {items.map((item) => (
                  <ChakraSelect.Item {...{ item, children: item.children ?? item.label }} key={item.value} />
                ))}
              </ChakraSelect.Content>
            </ChakraSelect.Positioner>
          </Portal>
        </ChakraSelect.Root>
        <Field.ErrorText>{errorMessage}</Field.ErrorText>
      </Field.Root>
    </Group>
  )
}
