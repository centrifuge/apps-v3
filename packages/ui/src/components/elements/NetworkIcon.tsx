import React from 'react'
import { Image, type ImageProps, Flex, Box } from '@chakra-ui/react'

import EthereumSvg from '../../assets/logos/ethereum.svg'
import ArbitrumSvg from '../../assets/logos/arbitrum.svg'
import CeloSvg from '../../assets/logos/celo.svg'
import BaseSvg from '../../assets/logos/base.svg'

export type Network = 'ethereum' | 'arbitrum' | 'celo' | 'base'

export const NETWORK_ID_MAP: Record<number, Network> = {
  1: 'ethereum', // Ethereum Mainnet
  11155111: 'ethereum', // Ethereum Sepolia
  42161: 'arbitrum', // Arbitrum One
  421614: 'arbitrum', // Arbitrum Sepolia
  42220: 'celo', // Celo Mainnet
  44787: 'celo', // Celo Alfajores
  8453: 'base', // Base Mainnet
  84532: 'base', // Base Sepolia
}

interface NetworkIconProps extends Omit<ImageProps, 'src'> {
  networkId?: number
  srcOverride?: string
  alt?: string
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({
  networkId = 1,
  srcOverride,
  boxSize = '24px',
  alt,
  ...rest
}) => {
  const localMap: Record<Network, string> = {
    ethereum: EthereumSvg,
    arbitrum: ArbitrumSvg,
    celo: CeloSvg,
    base: BaseSvg,
  }

  const resolvedNetwork = NETWORK_ID_MAP[networkId] || 'ethereum'
  const src = srcOverride || localMap[resolvedNetwork]

  return <Image src={src} boxSize={boxSize} objectFit="contain" alt={alt ?? `${resolvedNetwork} logo`} {...rest} />
}

interface NetworkIconsProps {
  networkIds?: number[]
  boxSize?: string
}

export const NetworkIcons: React.FC<NetworkIconsProps> = ({ networkIds, boxSize = '24px' }) => {
  const resolvedNetworks = networkIds?.map((id) => NETWORK_ID_MAP[id]).filter(Boolean) as Network[]

  if (!networkIds) return null

  return (
    <Flex role="group" align="center" className="group">
      {resolvedNetworks.map((network, i) => (
        <Box
          key={network}
          ml={i === 0 ? 0 : '-6px'}
          _groupHover={{ marginLeft: i === 0 ? 0 : '1px' }}
          transition="margin-left 200ms ease"
        >
          <NetworkIcon networkId={networkIds[i]} boxSize={boxSize} />
        </Box>
      ))}
    </Flex>
  )
}
