import { Grid, Skeleton } from '@chakra-ui/react'

export function HomePageSkeleton() {
  const cards = Array.from(Array(6).keys())

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
      {cards.map(() => (
        <Skeleton height="292px" width="315px" borderRadius="md" />
      ))}
    </Grid>
  )
}
