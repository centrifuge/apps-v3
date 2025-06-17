import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { FaRegClock } from 'react-icons/fa6'
import { infoText } from '../../../utils/infoText'
import { useFormikContext } from 'formik'
import type { FormValues } from './RedeemTab'
import { InfoWrapper } from '../InfoWrapper'

export const CancelRedeem = () => {
  const form = useFormikContext<FormValues>()
  return (
    <Box>
      <Heading>Rdemption in progress</Heading>
      <InfoWrapper text={infoText.cancelRedeem} title="Redemption in progress" icon={<FaRegClock />} />
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="statusInfo">
          Redeeming
        </Text>
        <Text color="statusInfo">{form.values.amount}</Text>
      </Flex>
      <Flex mt={4} justify="space-between">
        <Text fontWeight="bold" color="statusInfo">
          You receive
        </Text>
        <Text color="statusInfo">{form.values.amountToReceive}</Text>
      </Flex>
    </Box>
  )
}
