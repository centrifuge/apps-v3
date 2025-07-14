import { Balance } from '@centrifuge/sdk'
import { formatUIBalance } from '@centrifuge/shared'
import { BalanceDisplay, IconInfo } from '@centrifuge/ui'
import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react'

export const SummaryBox = ({
  title,
  summaryItems,
  infoText,
}: {
  title: string
  summaryItems: { label: string; balance: Balance; currency: string }[]
  infoText: string
}) => {
  return (
    <Box borderColor="gray.200" borderWidth={1} borderRadius="md" p={4}>
      <Heading size="md">{title}</Heading>

      {summaryItems && summaryItems.length > 0 && (
        <Stack gap={0} mt={4} mb={4}>
          {summaryItems.map((item, index) => (
            <Flex key={index} justifyContent="space-between" alignItems="center">
              <Heading color="gray.500" size="sm">
                {item.label}
              </Heading>
              <Text>{formatUIBalance(item.balance)}</Text>
            </Flex>
          ))}
        </Stack>
      )}

      {infoText && (
        <Flex alignItems="center" gap={2}>
          <Icon as={IconInfo} />
          <Text fontSize="xs">{infoText}</Text>
        </Flex>
      )}
    </Box>
  )
}
