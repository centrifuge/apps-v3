import { Grid, Stack } from '@chakra-ui/react'
import { Select, Input, useFormContext } from '@centrifuge/forms'
import { Control, useController } from 'react-hook-form'
import { useEffect } from 'react'

interface PoolStructureValues {
  poolType: string
  hubChains: string[]
  tokens: {
    symbolName: string
    minInvestment: string
    apyPercentage?: unknown
    tokenName?: string | undefined
    apy?: string | undefined
  }[]
  poolDenomination?: string | undefined
}

export const TokenSection = ({
  index,
  apy,
  control,
}: {
  index: number
  apy: { label: string; value: string }[]
  control: Control<PoolStructureValues>
}) => {
  const { setValue } = useFormContext()
  const { field: apyField } = useController({
    name: `tokens.${index}.apy`,
    control,
  })

  const { field: apyPercentageField } = useController({
    name: `tokens.${index}.apyPercentage`,
    control,
    shouldUnregister: true,
  })

  useEffect(() => {
    if (apyField.value === 'Automatic') {
      setValue(`tokens.${index}.apyPercentage`, undefined, { shouldValidate: true })
    } else {
      const current = apyPercentageField.value
      if (current === undefined || current === null) {
        setValue(`tokens.${index}.apyPercentage`, undefined, { shouldValidate: false })
      }
    }
  }, [apyField.value, index, setValue])

  return (
    <>
      <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
        <Stack>
          <Input
            name={`tokens.${index}.tokenName`}
            placeholder="Type here..."
            style={{ background: '#F6F6F6' }}
            label="Token name"
          />
        </Stack>

        <Stack>
          <Input
            name={`tokens.${index}.symbolName`}
            placeholder="Type here..."
            label="Token symbol (4-12 characters)*"
            style={{ background: '#F6F6F6' }}
          />
        </Stack>
      </Grid>

      <Grid templateColumns="1fr 1fr" gap={4} mt={8}>
        <Stack>
          <Input
            name={`tokens.${index}.minInvestment`}
            placeholder="Type here..."
            label="Min investment*"
            style={{ background: '#F6F6F6' }}
          />
        </Stack>

        <Stack>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Select
              value={[apyField.value || '']}
              name={`tokens.${index}.apy`}
              items={apy}
              label={'Apy'}
              style={{ background: '#F6F6F6' }}
            />

            {apyField.value !== 'Automatic' && (
              <Input
                value={[(apyPercentageField.value as string) || '']}
                name={`tokens.${index}.apyPercentage`}
                placeholder="Type here..."
                style={{ background: '#F6F6F6' }}
                mt={6}
              />
            )}
          </Grid>
        </Stack>
      </Grid>
    </>
  )
}
