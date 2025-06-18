import type { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'
import type { Address } from 'viem'

export function truncateAddress(string: Address) {
  const first = string.slice(0, 7)
  const last = string.slice(-7)

  return `${first}...${last}`
}

export function formatPercentage(amount: number, includeSymbol = true, locale = 'en', decimals = 2) {
  const formattedAmount = amount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return includeSymbol ? `${formattedAmount}%` : formattedAmount
}

export function formatBalanceAbbreviated(
  decimalVal: number | Decimal | string,
  displayDecimals = 1,
  currency?: string
): string {
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

export function formatBalance(
  amount: number | Decimal | string | Balance,
  currency?: string,
  precision = 0,
  minPrecision = precision
) {
  let val: Decimal
  if (typeof amount === 'number' || typeof amount === 'string') {
    val = new Decimal(amount.toString())
  } else {
    val = amount as Decimal
  }
  const formattedAmount = amount.toLocaleString('en', {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: precision,
  })
  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}
