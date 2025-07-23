/**
 * Converts a human-readable number (display value) into its integer base unit representation.
 * This is done by multiplying the value by 10 to the power of the specified number of decimals.
 * Uses BigInt for precision to avoid floating-point errors with large numbers.
 *
 * @param {string | number} displayValue - The human-readable value to convert (e.g., 123, "123.45").
 * @param {number} decimals - The number of decimal places the final unit has (e.g., 6 for USDC, 18 for ETH).
 * @returns {bigint} The value in its smallest integer unit (e.g., 123 with 6 decimals becomes 123000000n).
 * @throws {Error} If the input value is not a valid number or has more decimal places than the target precision.
 */
export function toBaseUnit(displayValue: string | number, decimals: number): bigint {
  if (typeof displayValue !== 'string' && typeof displayValue !== 'number') {
    throw new Error('Input value must be a string or a number.')
  }
  if (typeof decimals !== 'number' || !Number.isInteger(decimals) || decimals < 0) {
    throw new Error('Decimals must be a non-negative integer.')
  }

  const valueStr = String(displayValue)

  if (isNaN(Number(valueStr))) {
    throw new Error(`Invalid number provided: "${valueStr}"`)
  }

  const parts = valueStr.split('.')
  const integerPart = parts[0]
  let fractionalPart = parts[1] || ''

  if (fractionalPart.length > decimals) {
    throw new Error(
      `Input has more decimal places (${fractionalPart.length}) than the specified precision (${decimals}).`
    )
  }

  while (fractionalPart.length < decimals) {
    fractionalPart += '0'
  }

  const fullString = integerPart + fractionalPart
  return BigInt(fullString)
}
