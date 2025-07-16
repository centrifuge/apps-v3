export const infoText = (currency?: string) => ({
  redeem: `This is a freely transferable token. Redeeming requires the KYC. Click here to KYC with Entity.\
    Alternatively, you can redeem on Uniswap and other secondary markets.`,
  cancelRedeem:
    'Redeeming token happens asynchronously and can take up to 24hrs to reflect on the network. You may close this window.',
  portfolioMissingInvestmentCurrency: `You do not hold any of the currency needed for investing in this fund. Please purchase some ${currency} to invest.`,
  investorNotWhitelisted: `This is a freely transferable token. Investing and redeeming requires the KYC.\
    In order to KYC please send an emil to test@test.io.

Alternatively, you can buy and sell tokens on Uniswap and other secondary markets.`,
})
