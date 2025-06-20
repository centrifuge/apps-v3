import type { Dispatch, SetStateAction } from 'react'
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import { BalanceInput, Input } from '@centrifuge/forms'
import { Balance, PoolId } from '@centrifuge/sdk'
import { formatBalance, formatBalanceAbbreviated, usePortfolio, usePoolDetails } from '@centrifuge/shared'
import { NetworkIcons, type Network } from '@components/NetworkIcon'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { infoText } from '@utils/infoText'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'

const networks: Network[] = ['ethereum', 'arbitrum', 'celo', 'base']

export function InvestAmount({
  parsedAmount,
  setActionType,
}: {
  parsedAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}) {
  const { data: portfolio } = usePortfolio()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId)
  const minAmount = pool?.metadata?.shareClasses
    ? (Object.values(pool?.metadata?.shareClasses || {})[0].minInitialInvestment ?? 0)
    : 0

  const currency = portfolio?.[0]?.currency
  const balance = portfolio?.[0]?.balance

  return (
    <Box>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight={500}>You pay</Text>
        <Text opacity={0.5} alignSelf="flex-end">
          (min: {formatBalanceAbbreviated(minAmount, 2, pool?.currency.symbol)})
        </Text>
      </Flex>
      <BalanceInput
        name="amount"
        decimals={6}
        displayDecimals={6}
        placeholder="0.00"
        inputGroupProps={{
          endAddon: `${currency?.symbol || 'USDC'}`,
        }}
      />
      <Flex mt={2} justify="space-between">
        <Flex>
          <Badge background="bg-tertiary" color="text-primary" opacity={0.5} borderRadius={10} px={3} h="24px">
            MAX
          </Badge>
          <Text color="text-primary" opacity={0.5} alignSelf="flex-end" ml={2}>
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
            disabled
            variant="outline"
            inputGroupProps={{
              endAddon: 'deJTRYS',
            }}
          />
        </>
      )}
      <Button
        colorPalette="yellow"
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
