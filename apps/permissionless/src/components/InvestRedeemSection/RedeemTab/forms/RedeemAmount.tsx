import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { usePortfolio, formatBalance } from '@centrifuge/shared'
import { BalanceInput, Input, SubmitButton } from '@centrifuge/forms'
import type { Dispatch, SetStateAction } from 'react'
import { type RedeemActionType } from '../../components/defaults'
import { InfoWrapper } from '../../components/InfoWrapper'
import { infoText } from '../../../../utils/infoText'

export function RedeemAmount({
  parsedAmount,
}: {
  parsedAmount: 0 | Balance
  setActionType?: Dispatch<SetStateAction<RedeemActionType>>
}) {
  const { data: portfolio } = usePortfolio()

  const currency = portfolio?.[0]?.currency
  const balance = portfolio?.[0]?.balance

  return (
    <Box>
      <Text fontWeight={500} mb={2}>
        Redeem
      </Text>
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
            inputGroupProps={{
              endAddon: 'deJTRYS',
            }}
            variant="outline"
          />
        </>
      )}
      <SubmitButton colorPalette="yellow" disabled={parsedAmount === 0} width="100%">
        Redeem
      </SubmitButton>
      {parsedAmount === 0 && <InfoWrapper text={infoText.redeem} />}
    </Box>
  )
}
