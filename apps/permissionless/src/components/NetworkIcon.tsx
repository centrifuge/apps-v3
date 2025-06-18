// src/components/NetworkIcon.tsx

import React from 'react'
import { Image, type ImageProps, Flex, Box } from '@chakra-ui/react'

import EthereumSvg from '../assets/logos/ethereum.svg'
import ArbitrumSvg from '../assets/logos/arbitrum.svg'
import CeloSvg from '../assets/logos/celo.svg'
import BaseSvg from '../assets/logos/base.svg'

export type Network = 'ethereum' | 'arbitrum' | 'celo' | 'base'

interface NetworkIconProps extends Omit<ImageProps, 'src'> {
  network: Network
  srcOverride?: string
  alt?: string
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({ network, srcOverride, boxSize = '24px', alt, ...rest }) => {
  const localMap: Record<Network, string> = {
    ethereum: EthereumSvg,
    arbitrum: ArbitrumSvg,
    celo: CeloSvg,
    base: BaseSvg,
  }

  const src = srcOverride || localMap[network]

  return <Image src={src} boxSize={boxSize} objectFit="contain" alt={alt ?? `${network} logo`} {...rest} />
}

interface NetworkIconsProps {
  networks?: Network[]
  boxSize?: string
}

export const NetworkIcons: React.FC<NetworkIconsProps> = ({
  networks = ['ethereum', 'arbitrum', 'celo', 'base'],
  boxSize = '24px',
}) => {
  return (
    <Flex role="group" align="center" className="group">
      {networks.map((network, i) => (
        <Box
          key={network}
          ml={i === 0 ? 0 : '-6px'}
          _groupHover={{ marginLeft: i === 0 ? 0 : '1px' }}
          transition="margin-left 200ms ease"
        >
          <NetworkIcon network={network} boxSize={boxSize} />
        </Box>
      ))}
    </Flex>
  )
}
