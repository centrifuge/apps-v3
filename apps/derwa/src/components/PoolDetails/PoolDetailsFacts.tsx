import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { LinkPill } from './LinkPill'

export const PoolDetailsFacts = ({
  heading,
  topRow,
  bottomRow,
}: {
  heading: string
  topRow: { logo: ReactNode; links: { label: string; style?: Record<string, string> }[] }
  bottomRow: { leftPanel: { heading: string; text: string }; rightPanel: { items: { label: string; value: string }[] } }
}) => {
  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        {heading}
      </Heading>

      <Box
        bg="bg-primary"
        width="100%"
        padding={6}
        borderRadius={10}
        border="1px solid"
        borderColor="border-primary"
        shadow="xs"
      >
        <Grid templateColumns={{ base: '1fr', md: '1fr 5fr' }} gap={2}>
          <Flex justifyContent="flex-start" alignItems="center" gap={2} flexDirection={{ base: 'column', md: 'row' }}>
            <Box width={20} mb={{ base: 2, md: 0 }}>
              {topRow.logo && topRow.logo}
            </Box>
          </Flex>

          <Flex
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            flexDirection={{ base: 'column', md: 'row' }}
            wrap="wrap"
          >
            {topRow.links.map((link) => (
              <LinkPill key={link.label} label={link.label} styles={link.style} />
            ))}
          </Flex>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={2} mt={8}>
          <Flex
            flexDirection="column"
            alignItems={{ base: 'center', md: 'flex-start' }}
            justifyContent={{ base: 'center', md: 'flex-start' }}
            gap={{ base: 0, md: 4 }}
          >
            <Heading
              fontWeight="600"
              lineHeight={'125%'}
              size="xl"
              position="relative"
              _after={{
                content: '" "',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '54px',
                height: '2px',
                bg: '#FFC012',
              }}
            >
              {bottomRow.leftPanel.heading}
            </Heading>
            <Text fontSize="14px" color="#91969B" mt={8} fontWeight={400} lineHeight={'160%'}>
              {bottomRow.leftPanel.text}
            </Text>
          </Flex>
          <Box bg="bg-primary" shadow="xs" boxShadow="none" mt={{ base: 6, md: 0 }}>
            {bottomRow.rightPanel.items.map((item) => (
              <Flex justifyContent="space-between" alignItems="center" mt={4} key={item.label}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="#91969B">
                  {item.label}
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="#252B34">
                  {item.value}
                </Text>
              </Flex>
            ))}
          </Box>
        </Grid>
      </Box>
    </>
  )
}
