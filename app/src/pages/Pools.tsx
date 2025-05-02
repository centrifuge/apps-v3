import { Box, Stack, Text } from '@centrifuge/fabric'
import { formatBalance } from '../../src/utils/formatting'
import { LayoutSection } from '../components/LayoutBase/LayoutSection'
import { PoolList } from '../components/PoolList'
import { config } from '../config'

export default function PoolsPage() {
  const totalValueLocked = 999999999999999

  return (
    <LayoutSection>
      <Stack>
        <Stack>
          <Text as="h3" variant="heading3">
            Pools of real-world assets
          </Text>
          <Box mt={40}>
            <Box display="flex">
              <Text color="textSecondary" variant="body2" style={{ marginRight: 8 }}>
                Total value locked (TVL)
              </Text>
            </Box>
            <Text as="h1" variant="heading1" style={{ fontSize: 36 }}>
              {formatBalance(totalValueLocked ?? 0, config.baseCurrency)}
            </Text>
          </Box>
        </Stack>
      </Stack>
      <PoolList />
    </LayoutSection>
  )
}
