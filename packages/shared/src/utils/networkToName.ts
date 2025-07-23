export const networkToName = (networkId: number) => {
  switch (networkId) {
    case 1:
      return 'Ethereum'
    case 11155111:
      return 'Ethereum sepolia'
    case 42220:
      return 'Celo'
    case 42161:
      return 'Arbitrum'
    case 8453:
      return 'Base'
    case 84532:
      return 'Base sepolia'
    case 98866:
      return 'Plume'
    case 98867:
      return 'Plume testnet'
    case 43114:
      return 'Avalanche'
    case 43113:
      return 'Avalanche fuji'
    default:
      return 'Ethereum'
  }
}
