import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const PoolDetailsOverview = ({
  heading,
  items,
}: {
  heading: string
  items: { label: string; value: ReactNode | string }[]
}) => {
  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        {heading}
      </Heading>

      <Box
        bg="bg-primary"
        width="100%"
        padding={{ base: 6, md: 8 }}
        borderRadius={10}
        border="1px solid"
        borderColor="border-primary"
        shadow="xs"
      >
        {items.map((item) => (
          <Flex key={item.label} justifyContent="space-between" alignItems="center" mt={4}>
            <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
              {item.label}
            </Text>
            {typeof item.value !== 'string' ? (
              item.value
            ) : (
              <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                {item.value}
              </Text>
            )}
          </Flex>
        ))}
      </Box>
    </>
  )
}
