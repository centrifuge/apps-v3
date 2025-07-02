import { usePoolProvider } from '@contexts/PoolProvider'

export const handle = {
  hasSettings: false,
  hasTabs: true,
}

export default function Add() {
  const { shareClass } = usePoolProvider()
  console.log(shareClass)
  return <div>Add Holdings</div>
}
