import Decimal from 'decimal.js-light'

export function formatBalance(amount: number, currency?: string, precision = 0, minPrecision = precision) {
  const formattedAmount = amount.toLocaleString('en', {
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

export function formatPercentage(amount: number, includeSymbol = true, locale = 'en') {
  const formattedAmount = amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return includeSymbol ? `${formattedAmount}%` : formattedAmount
}

export function formatBalanceAbbreviated(decimalVal: number, displayDecimals = 1, currency?: string): string {
  let val: Decimal
  if (typeof decimalVal === 'number' || typeof decimalVal === 'string') {
    val = new Decimal(decimalVal.toString())
  } else {
    val = decimalVal as Decimal
  }

  const amountNumber = val.toNumber()
  const absVal = Math.abs(amountNumber)
  let formattedAmount = ''

  if (absVal >= 1e9) {
    formattedAmount = (amountNumber / 1e9).toFixed(displayDecimals) + 'B'
  } else if (absVal >= 1e6) {
    formattedAmount = (amountNumber / 1e6).toFixed(displayDecimals) + 'M'
  } else if (absVal >= 1e3) {
    formattedAmount = (amountNumber / 1e3).toFixed(displayDecimals) + 'K'
  } else {
    const rounded = val.toFixed(displayDecimals)
    const parts = rounded.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formattedAmount = parts.join('.')
  }

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}
