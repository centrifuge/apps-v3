import { Box, Card, Divider, Grid, Stack, Text } from '@centrifuge/fabric'
import type { Pool, ShareClass } from '@centrifuge/sdk'
import { usePoolDetails } from '../../hooks/usePools'
import { PoolStatus } from './PoolStatus'
import { useTheme } from 'styled-components'
import { ipfsToHttp } from '../../utils/IpfsToHttp'
import { formatBalanceAbbreviated, formatPercentage } from '../../utils/formatting'
import { RatingPill } from './RatingPill'

const ShareClasses = ({ tranches }: { tranches: ShareClass[] }) => {
  return tranches.map((tranche, index) => (
    <Grid key={index} columns={['1fr 1fr']} display="flex" justifyContent="space-between" maxWidth={300}>
      <Box>
        <Text variant="body1" color="textSecondary">
          APY
        </Text>
        <Text variant="heading1">{formatPercentage(tranche.apyPercentage)}</Text>
      </Box>
      <Box>
        <Text variant="body1" color="textSecondary">
          Min. Investment
        </Text>
        <Text variant="heading1">{formatBalanceAbbreviated(tranche.minInitialInvestment, 2)}</Text>
      </Box>
    </Grid>
  ))
}

export function PoolCard({ pool }: { pool: Pool }) {
  const theme = useTheme()
  const { data: details } = usePoolDetails(pool.id)
  const { metadata } = details ?? {}
  // TODO: change to share classes
  const tranches = Object.values(metadata?.tranches ?? {})

  if (!metadata) {
    return null
  }

  console.log(metadata)

  return (
    <Card padding={2} width={500}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Stack mr={4}>
          <Box maxWidth={120}>
            <PoolStatus status="Open for investments" />
          </Box>
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
      <Box my={1}>
        <Divider color={theme.colors.backgroundTertiary} />
      </Box>
      {tranches.length && <ShareClasses tranches={tranches} />}
      {metadata.pool.issuer.shortDescription && (
        <Box my={2}>
          <Text variant="body1" color="textSecondary">
            {metadata.pool.issuer.shortDescription}
          </Text>
        </Box>
      )}
      <Stack gap={1}>
        {metadata.pool.asset.class && (
          <Grid columns={['1fr 1fr']} display="flex" justifyContent="space-between">
            <Text variant="body1">Asset type</Text>
            <Text variant="body1">{metadata.pool.asset.class}</Text>
          </Grid>
        )}
        {metadata.pool.investorType && (
          <Grid columns={['1fr 1fr']} display="flex" justifyContent="space-between">
            <Text variant="body1">Investor type</Text>
            <Text variant="body1">{metadata.pool.investorType}</Text>
          </Grid>
        )}
        {metadata.pool.poolRatings?.length && (
          <Grid columns={['1fr', '1fr', '1fr', '1fr', '1fr']} display="flex" justifyContent="space-between">
            <Text variant="body1">Rating</Text>
            <Grid display="flex" justifyContent="space-between" gap={1}>
              {metadata.pool.poolRatings.map((rating) => (
                <RatingPill key={`${rating.agency}-${rating.reportUrl}-${rating.value}`} {...rating} />
              ))}
            </Grid>
          </Grid>
        )}
      </Stack>
    </Card>
  )
}
