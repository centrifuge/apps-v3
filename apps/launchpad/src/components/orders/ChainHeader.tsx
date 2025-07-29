import { networkToName } from '@centrifuge/shared'
import { NetworkIcon } from '@centrifuge/ui'
import { Flex, Heading } from '@chakra-ui/react'

export const ChainHeader = ({ chainId }: { chainId: string }) => {
  return (
    <Flex alignItems="center" gap={2} mb={4}>
      <NetworkIcon networkId={Number(chainId)} />
      <Heading fontSize="md" fontWeight="medium">
        {networkToName(Number(chainId))}
      </Heading>
    </Flex>
  )
}
