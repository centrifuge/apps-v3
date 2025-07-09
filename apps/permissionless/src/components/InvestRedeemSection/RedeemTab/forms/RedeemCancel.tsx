import type { Dispatch, SetStateAction } from 'react'
import { FaRegClock } from 'react-icons/fa6'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useFormContext } from '@centrifuge/forms'
import { infoText } from '@utils/infoText'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'

interface CancelRedeemProps {
  currencies: { investCurrency: string; receiveCurrency: string }
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemCancel({ currencies, setActionType }: CancelRedeemProps) {
  const { getValues } = useFormContext()
  const redeemText = `${getValues('redeemAmount').toString()} ${currencies.investCurrency}`
  const receiveText = `${getValues('receiveAmount').toString()} ${currencies.receiveCurrency}`

  return (
    <Box>
      <Heading>Rdemption in progress</Heading>
      <InfoWrapper text={infoText().cancelRedeem} title="Redemption in progress" icon={<FaRegClock />} />
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="info" fontSize="md">
          Redeeming
        </Text>
        <Text color="info" whiteSpace="normal" wordWrap="break-word" textAlign="right">
          {redeemText}
        </Text>
      </Flex>
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="info">
          You receive
        </Text>
        <Text color="info" whiteSpace="normal" wordWrap="break-word" textAlign="right">
          {receiveText}
        </Text>
      </Flex>
      <Button
        type="button"
        background="bg-disabled"
        color="text-primary"
        width="100%"
        mt={4}
        onClick={() => setActionType(RedeemAction.SUCCESS)}
      >
        Cancel request
      </Button>
    </Box>
  )
}
