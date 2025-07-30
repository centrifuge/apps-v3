import { Flex, Heading, Spinner } from '@chakra-ui/react'
import { PoolCardsSelect } from '@components/pools/PoolCardsSelect'
import { PoolsTvlCard } from '@components/pools/PoolsTvlCard'
import { usePoolsContext } from '@contexts/usePoolsContext'

export default function HomePage() {
  const { pools, setSelectedPoolId, isLoading } = usePoolsContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (isLoading) {
    return <Spinner size="lg" />
  }

  if (!poolIds?.length) return <h3>Sorry, there are no pools available at this time.</h3>

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" wrap="wrap" gap={6} my={8}>
        <Heading as="h1" size="2xl" m={8}>
          Access Tokenized
          <br />
          Assets on Centrifuge
        </Heading>
        <PoolsTvlCard poolIds={poolIds} />
      </Flex>

      <PoolCardsSelect poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
    </>
  )
}
