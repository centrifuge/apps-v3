import React from 'react'
import { Image, type ImageProps, Flex, Heading } from '@chakra-ui/react'
import usdc from '../../assets/logos/usdc.svg'
import usdt from '../../assets/logos/usdt.svg'
import bitcoin from '../../assets/logos/bitcoin.svg'

interface AssetIconProps extends Omit<ImageProps, 'src'> {
  assetSymbol?: AssetSymbol
  alt?: string
}

type AssetSymbol = 'USDC' | 'USDT' | 'WBTC'

export const AssetIcon: React.FC<AssetIconProps> = ({ assetSymbol = 'USDC', boxSize = '24px', alt, ...rest }) => {
  const iconMaps: Record<AssetSymbol, string> = {
    USDC: usdc,
    USDT: usdt,
    WBTC: bitcoin,
  }

  const src = iconMaps[assetSymbol.toUpperCase() as AssetSymbol]
  return <Image src={src} boxSize={boxSize} objectFit="contain" alt={alt ?? `${assetSymbol} logo`} {...rest} />
}

export const AssetIconText: React.FC<AssetIconProps> = ({ assetSymbol = 'USDC', boxSize = '24px', alt, ...rest }) => {
  return (
    <Flex alignItems="center" gap={2}>
      <AssetIcon assetSymbol={assetSymbol} boxSize={boxSize} alt={alt} {...rest} />
      <Heading size="sm">{assetSymbol}</Heading>
    </Flex>
  )
}
