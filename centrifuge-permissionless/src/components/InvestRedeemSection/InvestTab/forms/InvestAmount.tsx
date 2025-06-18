import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { NetworkIcons, type Network } from '../../../NetworkIcon'
import { useSelectedPoolContext } from '../../../../contexts/useSelectedPoolContext'
import { usePoolDetails } from '../../../../hooks/usePools'
import { Balance, PoolId } from '@centrifuge/sdk'
import { formatBalance, formatBalanceAbbreviated } from '../../../../utils/formatting'
import { usePortfolio } from '../../../../hooks/useInvestor'
import { BalanceInput, Input } from '../../../../forms'
import type { Dispatch, SetStateAction } from 'react'
import { InvestAction, type InvestActionType } from '../../components/defaults'
import { InfoWrapper } from '../../components/InfoWrapper'
import { infoText } from '../../../../utils/infoText'

const networks: Network[] = ['ethereum', 'arbitrum', 'celo', 'base']

export default function InvestAmount({
  parsedAmount,
  setActionType,
}: {
  parsedAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}) {
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId as PoolId)
  const minAmount = Object.values(pool?.metadata?.shareClasses || {})[0].minInitialInvestment || 0

  const currency = portfolio?.[0]?.currency
  const balance = portfolio?.[0]?.balance

  return (
    <Box>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight={500}>You pay</Text>
        <Text color="textPrimary" opacity={0.5} alignSelf="flex-end">
          (min: {formatBalanceAbbreviated(minAmount, 2, pool?.currency.symbol)})
        </Text>
      </Flex>
      <BalanceInput
        name="amount"
        decimals={6}
        displayDecimals={6}
        placeholder="0.00"
        size="2xl"
        background="backgroundPrimary"
        borderRadius={10}
        fontSize="2xl"
        inputGroupProps={{
          endAddon: `${currency?.symbol || 'USDC'}`,
          endAddonProps: {
            background: 'backgroundPrimary',
            borderRadius: '0px 10px 10px 0px',
          },
        }}
      />
      <Flex mt={2} justify="space-between">
        <Flex>
          <Badge background="backgroundTertiary" color="textPrimary" opacity={0.5} borderRadius={10} px={3} h="24px">
            MAX
          </Badge>
          <Text color="textPrimary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(balance ?? 0, currency?.symbol)}
          </Text>
        </Flex>
        <NetworkIcons networks={networks} />
      </Flex>
      {parsedAmount !== 0 && (
        <>
          <Text fontWeight={500} mt={6} mb={2}>
            You receive
          </Text>
          <Input
            name="amountToReceive"
            type="text"
            placeholder="0.00"
            size="2xl"
            background="backgroundPrimary"
            borderRadius={10}
            disabled
            _disabled={{
              opacity: 1,
            }}
            inputGroupProps={{
              endAddon: 'deJTRYS',
              endAddonProps: {
                background: 'backgroundPrimary',
                borderRadius: '0px 10px 10px 0px',
              },
            }}
          />
        </>
      )}
      <Button
        background="backgroundButtonHighlight"
        color="textPrimary"
        transition="box-shadow 0.2s ease"
        _hover={{
          boxShadow: 'xs',
        }}
        type="button"
        onClick={() => setActionType(InvestAction.INVESTOR_REQUIREMENTS)}
        disabled={parsedAmount === 0}
        width="100%"
        mt={4}
      >
        Invest
      </Button>
      {parsedAmount === 0 && <InfoWrapper text={infoText.redeem} />}
    </Box>
  )
}
