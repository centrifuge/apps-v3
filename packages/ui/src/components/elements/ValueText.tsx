import { Box, Text } from '@chakra-ui/react'

interface ValueTextProps {
  label: string
  value?: string | number
}

export function ValueText({ label, value = '0' }: ValueTextProps) {
  return (
    <Box>
      <Text color="gray.400" fontSize="0.75rem" fontWeight={500}>
        {label}
      </Text>
      <Text color="black.800" fontSize="1.25rem" fontWeight={600}>
        {value}
      </Text>
    </Box>
  )
}
