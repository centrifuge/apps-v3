import { PoolId } from '@centrifuge/sdk'
import { usePoolDetails } from '@centrifuge/shared'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { useSelectedPoolContext } from '@contexts/useSelectedPoolContext'
import { IoArrowBack } from 'react-icons/io5'
import { Outlet, useNavigate } from 'react-router-dom'

export default function PoolLayout() {
  const navigate = useNavigate()
  const { selectedPoolId } = useSelectedPoolContext()
  const { data: pool } = usePoolDetails(selectedPoolId as PoolId)

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <a href="" type="button" onClick={() => navigate('/')} aria-label="go back">
          <Flex alignItems="center">
            <IoArrowBack />
            <Heading size="2xl" ml={8}>
              {pool?.metadata?.pool.name}
            </Heading>
          </Flex>
        </a>
        <Box>
          <Heading size="xl" color="black" width="auto" textAlign="center">
            Current Holdings
          </Heading>
          <Text>$237,890</Text>
        </Box>
      </Flex>
      <Outlet />
    </>
  )
}
