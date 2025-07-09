import { useState } from 'react'
import { Field, Input, Group, IconButton, Text, Flex } from '@chakra-ui/react'
import { isAddress } from 'viem'
import { IoAddOutline } from 'react-icons/io5'
import { FaRegTrashAlt } from 'react-icons/fa'
import { truncateAddress } from '@centrifuge/shared'
import { NetworkIcon, NETWORK_ID_MAP } from '../elements/NetworkIcon'

export interface AddressInputProps {
  onAdd: (address: string) => void
  withSelection?: boolean
  addresses?: { address: string; chainId?: number }[]
  onDelete?: (address: string) => void
  chainId?: number
  label?: string
}

export const AddressInputLabel = ({
  address,
  chainId,
  onDelete,
}: {
  address: string
  chainId?: number
  onDelete: (address: string) => void
}) => {
  if (!isAddress(address)) return null
  const networkId = chainId || 1 // Default to Ethereum Mainnet if no chainId is provided
  const networkName = NETWORK_ID_MAP[networkId].charAt(0).toUpperCase() + NETWORK_ID_MAP[networkId].slice(1)

  return (
    <Flex
      justifyContent="space-between"
      border="1px solid"
      borderColor="border-primary"
      alignItems="center"
      mt={4}
      borderRadius={10}
      pl={1}
      pr={1}
      w="full"
    >
      <Text fontSize="sm">{truncateAddress(address)}</Text>
      <Flex alignItems="center" gap={2}>
        <NetworkIcon networkId={networkId} />
        <Text fontSize="sm">{networkName}</Text>
      </Flex>
      <IconButton size="sm" backgroundColor="white" color="text-disabled" onClick={() => onDelete(address)}>
        <FaRegTrashAlt />
      </IconButton>
    </Flex>
  )
}

export const AddressInput = ({ onAdd, onDelete, addresses, label = 'Wallet Address' }: AddressInputProps) => {
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleClick = () => {
    const valid = isAddress(value)
    setIsValid(valid)

    if (valid && typeof onAdd === 'function') {
      onAdd(value)
      setValue('')
    }
  }

  const handleDelete = (address: string) => {
    if (typeof onDelete === 'function') {
      onDelete(address)
    }
  }

  return (
    <Field.Root invalid={!isValid && value !== ''}>
      {label && <Field.Label>{label}</Field.Label>}
      <Group attached w="full" maxW="sm" display="flex" flexDirection="column" gap={2} alignItems="flex-start">
        <Flex alignItems="flex-start" w="full">
          <Input
            flex="1"
            placeholder="Add wallet address"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setIsValid(true)
            }}
            onBlur={() => setIsValid(isAddress(value))}
            size="sm"
            background="border-secondary"
            borderRadius={10}
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            zIndex={1}
          />
          <IconButton
            onClick={handleClick}
            aria-label="Add address"
            size="sm"
            backgroundColor="border-secondary"
            color="text-disabled"
            borderColor="border-primary"
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            borderLeft="none"
            variant="outline"
          >
            <IoAddOutline />
          </IconButton>
        </Flex>

        {addresses?.length
          ? addresses.map((address) => (
              <AddressInputLabel address={address.address} onDelete={handleDelete} chainId={address.chainId} />
            ))
          : null}
      </Group>

      {!isValid && value !== '' && <Field.ErrorText>Invalid address.</Field.ErrorText>}
    </Field.Root>
  )
}
