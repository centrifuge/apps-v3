import { Grid, Skeleton } from '@chakra-ui/react'

export function PoolCardsSelectSkeleton() {
  const cards = Array.from(Array(6).keys())

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
      {cards.map((_, index) => (
        <Skeleton key={index} height="292px" borderRadius="md" />
      ))}
    </Grid>
  )
}
