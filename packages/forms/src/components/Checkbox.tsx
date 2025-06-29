import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import { type CheckboxRootProps, Checkbox as ChakraCheckbox, Field } from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxRootProps, 'disabled' | 'onChange'> {
  name: FieldPath<TFieldValues>
  label: string
  rules?: object
  disabled?: boolean
  onChange?: (checked: boolean) => void // Optional callback for additional onChange logic
}

export function Checkbox<TFieldValues extends FieldValues = FieldValues>(props: InputProps<TFieldValues>) {
  const { label, name, rules, disabled, onChange, ...rest } = props

  const { control, trigger } = useFormContext<TFieldValues>()

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

  const isDisabled = formState.isSubmitting || disabled

  return (
    <Field.Root invalid={isError}>
      <ChakraCheckbox.Root
        {...field}
        {...rest}
        id={name}
        disabled={isDisabled}
        onBlur={() => trigger(name)} // Trigger validation on blur
        onCheckedChange={({ checked }: { checked: any }) => {
          field.onChange(checked)
          if (checked !== 'indeterminate') {
            onChange?.(checked) // Call any additional onChange from props
          }
        }}
      >
        <ChakraCheckbox.HiddenInput />
        <ChakraCheckbox.Control borderColor="black" borderRadius={4} />
        <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>
      </ChakraCheckbox.Root>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  )
}
