export function formatBalance(
  amount: number,
  currency?: string,
  precision = 0,
  minPrecision = precision
) {
  const formattedAmount = (
      amount
  ).toLocaleString('en', {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: precision,
  })
  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

export function formatDate(timestamp: number | string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    ...options,
  })
}