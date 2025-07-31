import { Box, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react'
import { LinkPill } from './LinkPill'
import { usePoolsContext } from '@contexts/usePoolsContext'
import { ipfsToHttp } from '@centrifuge/shared'

export function PoolDetailsFacts() {
  const { poolDetails } = usePoolsContext()
  const metadata = poolDetails?.metadata

  // TODO: Replace with actual values from poolDetails when available
  const items = [
    { label: 'Historical default rate', value: '1.2%' },
    { label: 'Fund admin', value: 'Galaxy' },
    {
      label: 'Trustee',
      value: 'UMB Bank, N.A.',
    },
    {
      label: 'Pricing oracle provider',
      value: 'Anemoy',
    },
    { label: 'Auditor', value: 'Ernst & Young LLP' },
    { label: 'Custodian', value: 'Galaxy' },
    { label: 'Investment manager', value: 'UMB Bank, N.A.' },
    { label: 'Sub-advisor', value: 'Anemoy' },
    { label: 'Pool analysis', value: 'Universal Co.' },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Key facts
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
              <Image
                src={ipfsToHttp(metadata?.pool.issuer.logo?.uri ?? '')}
                alt={metadata?.pool.issuer.name}
                height="2rem"
                fit="contain"
              />
            </Box>
          </Flex>

          <Flex
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            flexDirection={{ base: 'column', md: 'row' }}
            wrap="wrap"
          >
            {[{ label: 'Website' }, { label: 'Forum' }, { label: 'Email' }, { label: 'Summary' }].map((link) => (
              <LinkPill key={link.label} label={link.label} />
            ))}
          </Flex>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mt={8}>
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
                bg: 'yellow.500',
              }}
            >
              {metadata?.pool.issuer.name || 'Pool'}
            </Heading>
            <Text fontSize="14px" color="gray.500" fontWeight={400} lineHeight={'160%'} mt={3}>
              {metadata?.pool.issuer.description || 'No description available'}
            </Text>
          </Flex>
          <Box bg="bg-primary" shadow="xs" boxShadow="none" pt={4}>
            {items.map((item) => (
              <Flex justifyContent="space-between" alignItems="center" mt={4} key={item.label}>
                <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="gray.500">
                  {item.label}
                </Text>
                <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="gray.800">
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
