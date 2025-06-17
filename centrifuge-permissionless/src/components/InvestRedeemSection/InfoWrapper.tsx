import { Flex, Heading, Icon } from '@chakra-ui/react'
import { IoMdInformationCircleOutline } from 'react-icons/io'

export const InfoWrapper = ({ text, title, icon }: { text: string; title?: string; icon?: React.ReactNode }) => {
  return (
    <Flex mt={4} border="1px solid" borderColor="statusInfo" borderRadius={10} p={4}>
      <Icon size="lg" color="statusInfo" mr={2} mt={2}>
        {icon || <IoMdInformationCircleOutline />}
      </Icon>
      <Flex direction="column">
        <Heading fontSize="md" fontWeight="bold" color="statusInfo">
          {title}
        </Heading>
        <Heading fontSize="sm" color="statusInfo" lineHeight={1.5}>
          {text}
        </Heading>
      </Flex>
    </Flex>
  )
}
