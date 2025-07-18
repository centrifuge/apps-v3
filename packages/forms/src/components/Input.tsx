import type { ReactNode } from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import {
  type InputGroupProps,
  type InputProps as ChakraInputProps,
  Field,
  Input as ChakraInput,
  InputGroup,
} from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ChakraInputProps, 'onChange' | 'onBlur' | 'disabled'> {
  name: FieldPath<TFieldValues>
  label?: string
  rules?: object
  icon?: ReactNode
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputGroupProps?: Omit<InputGroupProps, 'children'>
}

export function Input<TFieldValues extends FieldValues = FieldValues>(props: InputProps<TFieldValues>) {
  const { disabled, inputGroupProps, name, rules, onChange, onBlur, label, ...rest } = props

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

  // Combine react-hook-form's onChange with any custom onChange provided
  const mergedOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e) // Call react-hook-form's onChange
    if (onChange) {
      onChange(e) // Call custom onChange if provided
    }
  }

  // Combine react-hook-form's onBlur with any custom onBlur provided,
  // and trigger react-hook-form validation on blur.
  const mergedOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur() // Call react-hook-form's onBlur
    trigger(name) // Trigger validation for the field on blur
    if (onBlur) {
      onBlur(e) // Call custom onBlur if provided
    }
  }

  const { isError, errorMessage } = useGetFormError<TFieldValues>({
    error,
    name,
  })

  const isDisabled = formState.isSubmitting || disabled

  return (
    <Field.Root invalid={isError}>
      {label && <Field.Label>{label}</Field.Label>}
      <InputGroup {...inputGroupProps}>
        <ChakraInput
          {...field}
          {...rest}
          id={name}
          disabled={isDisabled}
          onChange={mergedOnChange}
          onBlur={mergedOnBlur}
          borderRadius="md"
        />
      </InputGroup>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  )
}
