import { EmptyState, List, VStack } from '@chakra-ui/react'
import { HiColorSwatch } from 'react-icons/hi'

const NotFound = () => {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <HiColorSwatch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>No results found</EmptyState.Title>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}

export default NotFound
