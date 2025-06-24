import { formatUnits } from 'viem'

export function divideBigInts(numerator: bigint, denominator: bigint, decimals: number) {
  const scaledNumerator = numerator * 10n ** BigInt(decimals)
  return scaledNumerator / denominator
}

export function formatBigintToString(bigInt: bigint, bigintDecimals: number, formatDecimals?: number) {
  const decimals = formatDecimals || bigintDecimals
  return Number(formatUnits(bigInt, bigintDecimals)).toFixed(decimals)
}

export function formatDivideBigInts(
  numerator: bigint,
  denominator: bigint,
  bigintDecimals: number,
  formatDecimals?: number
) {
  const result = divideBigInts(numerator, denominator, bigintDecimals)
  const formattedResult = formatBigintToString(result, bigintDecimals, formatDecimals)

  return formattedResult
}
