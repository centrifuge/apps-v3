export const InvestAction = {
  INVEST_AMOUNT: 'INVEST_AMOUNT',
  INVESTOR_REQUIREMENTS: 'INVESTOR_REQUIREMENTS',
  SUCCESS: 'SUCCESS',
} as const

export type InvestActionType = (typeof InvestAction)[keyof typeof InvestAction]

export const InvestFormDefaultValues = {
  investAmount: '',
  receiveAmount: '',
  investorRequirements: [false, false, false],
}

export const RedeemAction = {
  REDEEM_AMOUNT: 'REDEEM_AMOUNT',
  CANCEL: 'CANCEL',
  SUCCESS: 'SUCCESS',
} as const

export type RedeemActionType = (typeof RedeemAction)[keyof typeof RedeemAction]

export const RedeemFormDefaultValues = {
  redeemAmount: '',
  receiveAmount: '',
}
