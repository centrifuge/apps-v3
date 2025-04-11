import { Stack, Text } from '@centrifuge/fabric'
import { useLocation } from 'react-router'

export const NotFoundPage = () => {
  const location = useLocation()

  return (
    <Stack gap={8} flex={1}>
      <h1 title="Page not found" />
      <Stack alignItems="center" gap="4">
        <Text variant="label1">The page {location.pathname} does not exist</Text>
      </Stack>
    </Stack>
  )
}
