import { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'

export type FormattableBalance = Balance | string | number | bigint

export interface FormatBalanceOptions {
  /** The number of decimal places to SHOW in the UI. */
  precision?: number
  /** The number of decimals the raw TOKEN has (e.g., 18 for ETH). Used for normalization. */
  tokenDecimals?: number
  /** Whether to add thousand separators (e.g., 1,234.56). */
  useGrouping?: boolean
  /** The currency symbol or name to append (e.g., "USD"). */
  currency?: string
  /**
   * Specifies the notation style for displaying numbers.
   * 'standard': Default number formatting (e.g., 1,234,567).
   * 'compact': Short-form for large numbers (e.g., 1.2M).
   */
  notation?: 'standard' | 'compact'
}

/**
 * Formats a web3 balance into a human-readable string.
 * It first normalizes the raw amount using tokenDecimals, then formats it for display.
 *
 * @param value The value to format (raw bigint from a contract or a pre-formatted value).
 * @param options Formatting options, including tokenDecimals for normalization.
 * @returns A formatted string representation of the value.
 */
export function formatBalance(
  value: FormattableBalance | null | undefined,
  options: FormatBalanceOptions = {}
): string {
  if (value === null || value === undefined) {
    return '0.00'
  }

  const { precision, tokenDecimals, useGrouping = true, currency, notation = 'standard' } = options

  let decimalValue: Decimal
  try {
    if (value instanceof Balance) {
      decimalValue = value.toDecimal()
    } else if (tokenDecimals !== undefined) {
      const rawAmount = new Decimal(value.toString())
      const divisor = new Decimal(10).pow(tokenDecimals)
      decimalValue = rawAmount.div(divisor)
    } else {
      decimalValue = new Decimal(value.toString())
    }
  } catch (error) {
    console.error('Failed to format balance for value:', value, error)
    return '0.00'
  }

  const intlOptions: Intl.NumberFormatOptions = {
    useGrouping,
    notation,
  }

  if (notation === 'compact') {
    intlOptions.minimumFractionDigits = precision ?? 0
    intlOptions.maximumFractionDigits = precision ?? 2
  } else {
    if (precision !== undefined) {
      intlOptions.minimumFractionDigits = precision
      intlOptions.maximumFractionDigits = precision
    } else {
      intlOptions.minimumFractionDigits = 2
      intlOptions.maximumFractionDigits = 6
    }
  }

  const numberToFormat = decimalValue.toNumber()
  const formattedNumber = new Intl.NumberFormat('en-US', intlOptions).format(numberToFormat)

  return `${formattedNumber} ${currency || ''}`.trim()
}
