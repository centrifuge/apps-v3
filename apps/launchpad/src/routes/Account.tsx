import { Loader } from '@chakra-ui/react'
import { AccountPage } from '@components/account/AccountPage'
import { useSelectedPool } from '@contexts/SelectedPoolProvider'
import { Navigate } from 'react-router-dom'

export default function Account() {
  const { shareClassDetails, isLoading, poolDetails } = useSelectedPool()

  if (isLoading) {
    return <Loader />
  }

  if (!shareClassDetails || !poolDetails) {
    return <Navigate to="/" />
  }

  return <AccountPage />
}
