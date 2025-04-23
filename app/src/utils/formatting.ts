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
