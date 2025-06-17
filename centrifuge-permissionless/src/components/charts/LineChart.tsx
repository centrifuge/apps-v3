import { Box, useToken } from '@chakra-ui/react'
import { ResponsiveContainer, ComposedChart, Line, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

type DataPoint = {
  timestamp: string
  price: number
}

export const LineChart = ({ data }: { data: DataPoint[] }) => {
  const [backgroundTertiary, textHighlight, borderPrimary, textSecondary] = useToken('colors', [
    'backgroundTertiary',
    'textHighlight',
    'borderPrimary',
    'textSecondary',
  ])

  const formatMonth = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <Box height="200px" width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPoolValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={textHighlight} stopOpacity={0.4} />
              <stop offset="95%" stopColor={textHighlight} stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={borderPrimary} vertical={false} />

          <Bar dataKey="tvl" barSize={20} fill={backgroundTertiary} fillOpacity={1} strokeWidth={0} />

          <Line type="monotone" dataKey="price" stroke={textHighlight} dot={false} strokeWidth={2} />

          <XAxis
            dataKey="timestamp"
            tickFormatter={formatMonth}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '10px', fill: textSecondary }}
          />

          <YAxis
            domain={['dataMin - 10', 'dataMax + 10']}
            tickFormatter={(val) => `${val}`}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '10px', fill: textSecondary }}
          />

          <Tooltip
            labelFormatter={(labelTs) => {
              const d = new Date(labelTs)
              return d.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
              })
            }}
            formatter={(value: number) => [`${value}`, 'Price']}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}
