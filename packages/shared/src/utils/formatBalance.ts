import { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'

export type FormattableBalance = Balance | string | number | bigint

export interface FormatBalanceOptions {
  /** The number of decimal places to show. Defaults to dynamic. */
  precision?: number
  /** Whether to add thousand separators (e.g., 1,234.56). Default: true */
  useGrouping?: boolean
}

/**
 * Formats a balance-like value into a human-readable string with thousand separators.
 *
 * @param value The value to format (Balance, string, number, or bigint).
 * @param options Formatting options (e.g., precision, useGrouping).
 * @returns A formatted string representation of the value.
 */
export function formatBalance(
  value: FormattableBalance | null | undefined,
  options: FormatBalanceOptions = {}
): string {
  if (value === null || value === undefined) {
    return '0.00'
  }

  const { precision, useGrouping = true } = options

  let decimalValue: Decimal

  try {
    if (value instanceof Balance) {
      decimalValue = value.toDecimal()
    } else {
      decimalValue = new Decimal(value.toString())
    }
  } catch (error) {
    console.error('Failed to format balance for value:', value, error)
    return '0.00'
  }

  const intlOptions: Intl.NumberFormatOptions = {
    useGrouping: useGrouping,
  }

  if (precision !== undefined) {
    intlOptions.minimumFractionDigits = precision
    intlOptions.maximumFractionDigits = precision
  } else {
    intlOptions.minimumFractionDigits = 2
    intlOptions.maximumFractionDigits = 6
  }

  const numberToFormat = decimalValue.toNumber()

  return new Intl.NumberFormat('en-US', intlOptions).format(numberToFormat)
}
