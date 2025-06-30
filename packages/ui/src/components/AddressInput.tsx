import { useState } from 'react'
import { Field, Input, Group, IconButton, Stack, Text, Flex } from '@chakra-ui/react'
import { isAddress } from 'viem'
import { IoAddOutline } from 'react-icons/io5'
import { FaRegTrashAlt } from 'react-icons/fa'
import { truncateAddress } from '@centrifuge/shared'

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
      borderRadius="md"
      p={1}
      alignItems="center"
    >
      <Text fontSize="sm">{truncateAddress(address)}</Text>
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
    <Stack>
      <Field.Root invalid={!isValid && value !== ''}>
        <Field.Label>Wallet Address</Field.Label>
        <Group attached w="full" maxW="sm">
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
          />
          <IconButton
            onClick={handleClick}
            aria-label="Add address"
            size="sm"
            backgroundColor="border-secondary"
            color="text-disabled"
            borderColor="border-primary"
          >
            <IoAddOutline />
          </IconButton>
        </Group>

        {!isValid && value !== '' && <Field.ErrorText>Invalid address.</Field.ErrorText>}
      </Field.Root>
      {existingAddresses.length
        ? existingAddresses.map((address) => <AddressInputLabel address={address} onDelete={handleDelete} />)
        : null}
    </Stack>
  )
}
