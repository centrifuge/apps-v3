import { Box, Card, Divider, Grid, Stack, Text } from '@centrifuge/fabric'
import type { Pool } from '@centrifuge/sdk'
import { usePoolDetails } from '../../hooks/usePools'
import { PoolStatus } from './PoolStatus'
import { useTheme } from 'styled-components'
import { ipfsToHttp } from '../../utils/IpfsToHttp'

export function PoolCard({ pool }: { pool: Pool }) {
  const theme = useTheme()
  const { data: details } = usePoolDetails(pool.id)
  const { metadata } = details ?? {}

  if (!metadata) {
    return null
  }

  return (
    <Card padding={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Stack mr={4}>
          <PoolStatus status="Open for investments" />
          <Text variant="heading2" style={{ marginTop: 4 }}>
            {metadata.pool.name}
          </Text>
        </Stack>
        <Box
          as="img"
          src={ipfsToHttp(metadata.pool.icon?.uri ?? '')}
          alt=""
          height={38}
          width={38}
          border={`1px solid ${theme.colors.backgroundTertiary}`}
          borderRadius={4}
        />
      </Box>
      <Divider color={theme.colors.backgroundTertiary} />
    </Card>
  )
}
