export const networkToName = (networkId: number) => {
  switch (networkId) {
    case 1:
    case 11155111:
      return 'Ethereum'
    case 42220:
      return 'Celo'
    case 42161:
      return 'Arbitrum'
    case 8453:
      return 'Base'
    default:
      return 'Ethereum'
  }
}
