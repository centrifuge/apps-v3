import { useState } from 'react'
import { Field, Input, Group, IconButton, Stack, Text, Flex, Box } from '@chakra-ui/react'
import { isAddress } from 'viem'
import { IoAddOutline } from 'react-icons/io5'
import { FaRegTrashAlt } from 'react-icons/fa'
import { truncateAddress } from '@centrifuge/shared'
import { NetworkIcon } from './NetworkIcon'

export interface AddressInputProps {
  onClick: (address: string | string[]) => void
  withSelection?: boolean
  addresses?: string[]
}

export const AddressInputLabel = ({ address, onDelete }: { address: string; onDelete: (address: string) => void }) => {
  if (!isAddress(address)) return null

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
        <NetworkIcon />
        <Text fontSize="sm">Ethereum</Text>
      </Flex>
      <IconButton size="sm" backgroundColor="white" color="text-disabled" onClick={() => onDelete(address)}>
        <FaRegTrashAlt />
      </IconButton>
    </Flex>
  )
}

export const AddressInput = ({ onClick, addresses }: AddressInputProps) => {
  const [existingAddresses, setExistingAddresses] = useState<string[]>(addresses || [])
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleClick = () => {
    const valid = isAddress(value)
    setIsValid(valid)
    if (addresses?.includes(value)) return
    if (valid) {
      const newAddresses = [...existingAddresses, value]
      setValue('')
      setExistingAddresses([...existingAddresses, value])
      addresses?.length ? onClick(newAddresses) : onClick(value)
    }
  }

  const handleDelete = (address: string) => {
    setExistingAddresses(existingAddresses.filter((a) => a !== address))
  }

  return (
    <Field.Root invalid={!isValid && value !== ''}>
      <Field.Label>Wallet Address</Field.Label>
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

        {existingAddresses.length
          ? existingAddresses.map((address) => <AddressInputLabel address={address} onDelete={handleDelete} />)
          : null}
      </Group>

      {!isValid && value !== '' && <Field.ErrorText>Invalid address.</Field.ErrorText>}
    </Field.Root>
  )
}
