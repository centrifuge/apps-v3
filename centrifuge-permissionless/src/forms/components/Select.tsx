import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import {
  type SelectRootProps,
  type SelectValueChangeDetails,
  createListCollection,
  Field,
  Portal,
  Select as ChakraSelect,
} from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'
import { useState } from 'react'

export interface CustomSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SelectRootProps, 'collection'> {
  items: Array<{ label: string; value: string }>
  label: string
  name: FieldPath<TFieldValues>
  rules?: object
}

export function Select<TFieldValues extends FieldValues = FieldValues>(props: CustomSelectProps<TFieldValues>) {
  const [value, setValue] = useState<string[]>([])
  const { control, trigger } = useFormContext()
  const { name, rules, label, items, ...rest } = props

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

  const handleChange = async (details: SelectValueChangeDetails<{ label: string; value: string }>) => {
    const value = details.value[0]
    field.onChange(value === '' ? undefined : value) // Call react-hook-form's onChange with the selected value
    setValue(value === '' ? [] : [value]) // Update local state for controlled component
    await trigger(name) // Trigger validation for the field
  }

  const frameworks = createListCollection({ items })

  return (
    <Field.Root invalid={isError} disabled={formState.isSubmitting} id={name}>
      <Field.Label>{label}</Field.Label>
      <ChakraSelect.Root collection={frameworks} value={value} onValueChange={handleChange} {...rest}>
        <ChakraSelect.HiddenSelect />
        <ChakraSelect.Control>
          <ChakraSelect.Trigger>
            <ChakraSelect.ValueText placeholder={label} />
          </ChakraSelect.Trigger>
          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>
        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {frameworks.items.map((framework) => (
                <ChakraSelect.Item item={framework} key={framework.value}>
                  {framework.label}
                  <ChakraSelect.ItemIndicator />
                </ChakraSelect.Item>
              ))}
            </ChakraSelect.Content>
          </ChakraSelect.Positioner>
        </Portal>
      </ChakraSelect.Root>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  )
}
