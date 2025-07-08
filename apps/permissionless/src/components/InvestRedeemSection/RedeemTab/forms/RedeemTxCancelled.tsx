import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { IoMdTimer } from 'react-icons/io'
import { useFormContext } from '@centrifuge/forms'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'
import { type Dispatch, type SetStateAction } from 'react'

interface RedeemTxCancelledProps {
  currencies: { investCurrency: string; receiveCurrency: string }
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTxCancelled({ currencies, setActionType }: RedeemTxCancelledProps) {
  const { getValues } = useFormContext()
  const { reset } = useFormContext()

  return (
    <Box height="100%">
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        gap={2}
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Box width="100%" overflow="hidden">
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Heading>Redemption cancelled</Heading>
            <Icon size="xl">
              <IoMdTimer color="gray.400" />
            </Icon>
          </Flex>
          <Box opacity={0.5}>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} width="100%">
              <Box>
                <Text fontWeight={500}>You cancelled redeeming</Text>
                <Heading fontSize="lg">{getValues('redeemAmount').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{currencies.investCurrency}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6}>
              <Box>
                <Text fontWeight={500}>You would have received</Text>
                <Heading fontSize="lg">{getValues('amountToReceive').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{currencies.receiveCurrency}</Text>
            </Flex>
          </Box>
        </Box>
        <Button
          colorPalette="yellow"
          type="button"
          mb={4}
          onClick={() => {
            reset()
            setActionType(RedeemAction.REDEEM_AMOUNT)
          }}
          width="100%"
          mt={4}
        >
          Redeem again
        </Button>
      </Flex>
    </Box>
  )
}
