import { Box, Checkbox, Flex, Heading, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import type { FormValues } from './InvestTab'

const options = [
  'I am a non-US citizen or entity',
  'I am not on a sanctioned list',
  'I will KYC upon redeeming or sell over Uniswap or anther 3rd party market provider',
]

export default function InvestorRequirementsPanel() {
  const form = useFormikContext<FormValues>()
  return (
    <Box>
      <Heading mt={4} mb={4}>
        Investor Requirements
      </Heading>
      <Text>In order to invest in the following token you need to confirm the following:</Text>
      <Flex flexDirection="column" gap={4} mt={4} mb={4}>
        {options.map((option) => (
          <Checkbox.Root
            size="lg"
            key={option}
            variant="outline"
            borderRadius={10}
            colorPalette="textPrimary"
            checked={form.values.investorRequirements.includes(option)}
            onCheckedChange={(value) => {
              const { checked } = value as { checked: boolean }
              if (checked) {
                form.setFieldValue('investorRequirements', [...form.values.investorRequirements, option])
              } else {
                form.setFieldValue(
                  'investorRequirements',
                  form.values.investorRequirements.filter((o: string) => o !== option)
                )
              }
            }}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control borderColor="black" borderRadius={4} />
            <Checkbox.Label>{option}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Flex>
    </Box>
  )
}
