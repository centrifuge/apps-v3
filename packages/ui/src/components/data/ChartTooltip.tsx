import { Box, Text } from '@chakra-ui/react'
import { TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  textColor: string
  borderColor: string
}

export function ChartTooltip({ active, payload, label, textColor, borderColor }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const formattedLabel = new Date(label as string).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    return (
      <Box
        p="3"
        borderRadius="lg"
        boxShadow="lg"
        style={{
          backgroundColor: 'white',
          border: `1px solid ${borderColor}`,
        }}
      >
        <Text fontSize="sm" fontWeight="medium" mb="2" style={{ color: textColor }}>
          {formattedLabel}
        </Text>

        {payload.map((entry, index) => (
          <Box key={`item-${index}`} display="flex" justifyContent="space-between" alignItems="center" fontSize="sm">
            <Text fontWeight="normal" style={{ color: textColor }}>
              {entry.name === 'price' ? 'Price:' : entry.name === 'tvl' ? 'TVL:' : `${entry.name}:`}
            </Text>
            <Text fontWeight="medium" ml="4" style={{ color: textColor }}>
              {entry.value !== undefined ? `${entry.value}` : 'N/A'}
            </Text>
          </Box>
        ))}
      </Box>
    )
  }

  return null
}
