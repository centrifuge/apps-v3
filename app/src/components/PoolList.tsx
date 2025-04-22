import { Shelf, Text } from '@centrifuge/fabric'

export function PoolList() {
  const listedPools = [];

  if (!listedPools.length) {
    return (
      <Shelf p={4} justifyContent="center" textAlign="center">
        <Text variant="heading2" color="textSecondary">
          There are no pools yet
        </Text>
      </Shelf>
    )
  }
}
