import { Box, Stack, Text } from '@centrifuge/fabric'
import { LayoutSection } from '../components/LayoutBase/LayoutSection'
import { PoolList } from '../components/PoolList'

export default function PoolsPage() {
  return (
    <LayoutSection>
      <Stack>
        <Stack>
          <Text as="h3" variant="heading2">
            Pools of real-world assets
          </Text>
        </Stack>
      </Stack>
      <Box mt={4}>
        <PoolList />
      </Box>
    </LayoutSection>
  )
}
