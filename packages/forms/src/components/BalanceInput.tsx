import type {
  ChangeEvent as ReactChangeEvent,
  ClipboardEvent as ReactClipboardEvent,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import {
  type InputGroupProps,
  type InputProps as ChakraInputProps,
  Field,
  Input as ChakraInput,
  InputGroup,
  NativeSelect,
  Flex,
  Text,
  Group,
  Button,
} from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'
import { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'

const inputSizes = ['sm', 'md', 'lg', 'xl', '2xl', '2xs', 'xs'] as const
export interface BalanceInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ChakraInputProps, 'onChange' | 'onBlur' | 'disabled' | 'value'> {
  currency?: string
  name: FieldPath<TFieldValues>
  label?: string
  rules?: object
  icon?: ReactNode
  disabled?: boolean
  decimals?: number // For Balance creation
  displayDecimals?: number // For limiting display decimals
  onChange?: (value: string, balance?: Balance) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputGroupProps?: Omit<InputGroupProps, 'children'>
  selectOptions?: { label: string; value: number | string }[]
  onSelectChange?: (value: number | string) => void
  subLabel?: string
  buttonLabel?: string
  onButtonClick?: () => void
}

const CurrencySelect = ({
  options,
  onChange,
}: {
  options: { label: string; value: number | string }[]
  onChange: (value: number | string) => void
}) => {
  if (options.length === 0) return null

  return (
    <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
      <NativeSelect.Field fontSize="sm" onChange={(e) => onChange(e.target.value)} bg="white">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}

export function BalanceInput<TFieldValues extends FieldValues = FieldValues>(props: BalanceInputProps<TFieldValues>) {
  const {
    currency,
    disabled,
    inputGroupProps,
    name,
    rules,
    onChange,
    onBlur,
    decimals = 6,
    displayDecimals,
    selectOptions,
    onSelectChange,
    label,
    subLabel,
    buttonLabel,
    size = 'md',
    onButtonClick,
    defaultValue,
    ...rest
  } = props
  const currentDisplayDecimals = displayDecimals || decimals

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

  // Helper function to limit decimal places in string
  const limitDecimals = (value: string, maxDecimals: number): string => {
    if (!value || value === '' || value === '.') return value

    const parts = value.split('.')
    if (parts.length <= 1) return value

    const limitedDecimalPart = parts[1].slice(0, maxDecimals)
    return `${parts[0]}.${limitedDecimalPart}`
  }

  // Convert field value to display string
  const getDisplayValue = (value: Balance | number | string): string => {
    let displayValue = ''

    if (value instanceof Balance) {
      displayValue = value.toFloat().toString()
    } else if (typeof value === 'number') {
      displayValue = value.toString()
    } else if (typeof value === 'string') {
      displayValue = value
    }

    return limitDecimals(displayValue, currentDisplayDecimals)
  }

  const mergedOnChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Prevent invalid input patterns
    if (value === '' || value === '.' || /^\d*\.?\d*$/.test(value)) {
      // Limit decimal places in real-time
      value = limitDecimals(value, currentDisplayDecimals)

      e.target.value = value

      field.onChange(value)

      if (onChange) {
        try {
          const numValue = parseFloat(value)
          if (!isNaN(numValue) && value !== '' && value !== '.') {
            const balance = Balance.fromFloat(numValue, decimals)
            onChange(value, balance)
          } else {
            onChange(value)
          }
        } catch {
          onChange(value)
        }
      }
    }
  }

  const mergedOnBlur = (e: ReactFocusEvent<HTMLInputElement>) => {
    // Format the value with fixed decimal places when user leaves the field
    const currentValue = e.target.value
    if (currentValue && currentValue !== '' && currentValue !== '.') {
      const decimalValue = new Decimal(currentValue)
      const truncatedValue = decimalValue.toDecimalPlaces(currentDisplayDecimals, Decimal.ROUND_DOWN)
      const formattedValue = truncatedValue.toString()

      field.onChange(formattedValue)
    }

    field.onBlur()
    trigger(name)

    if (onBlur) {
      onBlur(e)
    }
  }

  // Handle paste events to ensure pasted content respects decimal limits
  const handlePaste = (e: ReactClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const numericValue = pastedText.replace(/[^0-9.]/g, '')

    if (/^\d*\.?\d*$/.test(numericValue)) {
      const limitedValue = limitDecimals(numericValue, currentDisplayDecimals)
      const syntheticEvent = {
        target: { value: limitedValue },
      } as React.ChangeEvent<HTMLInputElement>
      mergedOnChange(syntheticEvent)
    }
  }

  // Handle key press to prevent invalid characters
  const handleKeyPress = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const { key } = e
    const currentValue = (e.target as HTMLInputElement).value

    // Allow control keys
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)
    ) {
      return
    }

    // Allow only numbers and decimal point
    if (!/[\d.]/.test(key)) {
      e.preventDefault()
      return
    }

    // Prevent multiple decimal points
    if (key === '.' && currentValue.includes('.')) {
      e.preventDefault()
      return
    }

    // Check if adding this character would exceed decimal limit
    if (currentValue.includes('.')) {
      const decimalPart = currentValue.split('.')[1]
      if (decimalPart && decimalPart.length >= currentDisplayDecimals && key !== '.') {
        e.preventDefault()
        return
      }
    }
  }

  const { isError, errorMessage } = useGetFormError<TFieldValues>({
    error,
    name,
  })

  const isDisabled = formState.isSubmitting || disabled

  const buttonSize = typeof size === 'string' ? inputSizes.indexOf(size) : 1

  return !buttonLabel ? (
    <Field.Root invalid={isError}>
      <Flex alignItems="center" gap={2}>
        {label && <Field.Label>{label}</Field.Label>}
        {subLabel && (
          <Text fontSize="sm" color="gray.500">
            {subLabel}
          </Text>
        )}
      </Flex>
      <InputGroup
        {...inputGroupProps}
        endElement={
          selectOptions && selectOptions.length > 0 ? (
            <CurrencySelect
              options={selectOptions}
              onChange={(value) => {
                if (onSelectChange) {
                  onSelectChange(value)
                }
              }}
            />
          ) : currency ? (
            currency
          ) : undefined
        }
      >
        <ChakraInput
          {...rest}
          bg={rest.bg ?? 'gray.300'}
          id={name}
          name={name}
          ref={field.ref}
          type="text"
          value={getDisplayValue(field.value)}
          disabled={isDisabled}
          onChange={mergedOnChange}
          onBlur={mergedOnBlur}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          inputMode="decimal" // Shows numeric keypad on mobile
          variant={rest.variant ?? 'outline'}
          borderRadius="md"
        />
      </InputGroup>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  ) : (
    <Field.Root>
      {label && <Field.Label>{label}</Field.Label>}
      <Group attached border="1px solid" borderColor={isError ? 'red.500' : 'gray.200'} borderRadius="md">
        <ChakraInput
          {...rest}
          id={name}
          name={name}
          ref={field.ref}
          type="text"
          value={getDisplayValue(field.value)}
          disabled={isDisabled}
          onChange={mergedOnChange}
          onBlur={mergedOnBlur}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          inputMode="decimal" // Shows numeric keypad on mobile
          variant="subtle"
          backgroundColor="white"
          defaultValue={defaultValue}
          border="transparent"
          borderRadius="md"
          _focusVisible={{
            borderColor: 'transparent',
          }}
        />
        <Text>{currency}</Text>
        <Button
          variant="plain"
          size={inputSizes[buttonSize + 1]}
          backgroundColor="gray.100"
          color="text-secondary"
          border="transparent"
          ml={2}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      </Group>

      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  )
}
