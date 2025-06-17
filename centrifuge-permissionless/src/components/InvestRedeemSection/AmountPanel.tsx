import { Badge, Box, Flex, Input, InputGroup, Text } from '@chakra-ui/react'
import { NetworkIcons, type Network } from '../NetworkIcon'
import type { FormValues } from './InvestTab/InvestTab'
import { useFormikContext } from 'formik'
import { useSelectedPoolContext } from '../../contexts/useSelectedPoolContext'
import { usePoolDetails } from '../../hooks/usePools'
import { Balance, PoolId } from '@centrifuge/sdk'
import { formatBalance, formatBalanceAbbreviated } from '../../utils/formatting'
import { usePortfolio } from '../../hooks/useInvestor'

const networks: Network[] = ['ethereum', 'arbitrum', 'celo', 'base']

export default function AmountPanel({ isInvesting = false }: { isInvesting?: boolean }) {
  const { data: portfolio } = usePortfolio()
  const form = useFormikContext<FormValues>()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId as PoolId)
  const minAmount = Object.values(pool?.metadata?.shareClasses || {})[0].minInitialInvestment || 0

  const currency = portfolio?.[0]?.currency
  const balance = portfolio?.[0]?.balance

  return (
    <Box>
      {isInvesting ? (
        <Flex justify="space-between" mb={2}>
          <Text fontWeight={500}>You pay</Text>
          <Text color="textPrimary" opacity={0.5} alignSelf="flex-end">
            (min: {formatBalanceAbbreviated(minAmount, 2, pool?.currency.symbol)})
          </Text>
        </Flex>
      ) : (
        <Text fontWeight={500} mb={2}>
          Redeem
        </Text>
      )}
      <InputGroup
        endAddon="USDC"
        endAddonProps={{
          background: 'backgroundPrimary',
          borderRadius: '0px 10px 10px 0px',
        }}
      >
        <Input
          type="number"
          placeholder="0.00"
          size="2xl"
          background="backgroundPrimary"
          borderRadius={10}
          value={form.values.amount}
          onChange={(e) => {
            form.setFieldValue('amount', e.target.value)
          }}
          fontSize="2xl"
        />
      </InputGroup>
      <Flex mt={2} justify="space-between">
        <Flex>
          <Badge background="backgroundTertiary" color="textPrimary" opacity={0.5} borderRadius={10} px={3} h="24px">
            MAX
          </Badge>
          <Text color="textPrimary" opacity={0.5} alignSelf="flex-end" ml={2}>
            {formatBalance(balance ?? 0, currency?.symbol)}
          </Text>
        </Flex>
        {isInvesting && <NetworkIcons networks={networks} />}
      </Flex>
      {form.values.amount > 0 && (
        <>
          <Text fontWeight={500} mt={6} mb={2}>
            You receive
          </Text>
          <InputGroup
            endAddon="deJTRYS"
            endAddonProps={{
              background: 'backgroundPrimary',
              borderRadius: '0px 10px 10px 0px',
            }}
          >
            <Input
              placeholder="0.00"
              size="2xl"
              background="backgroundPrimary"
              borderRadius={10}
              disabled
              _disabled={{
                opacity: 1,
              }}
            />
          </InputGroup>
        </>
      )}
    </Box>
  )
}
