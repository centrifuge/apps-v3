import { BalanceInput, Checkbox } from '@centrifuge/forms'
import { Card, Tooltip } from '@centrifuge/ui'
import { Box, Grid, Text } from '@chakra-ui/react'

const tooltipContent = {
  approveAndIssue:
    'Approve investment and issue shares with a specified NAV at the same time. Otherwise, shares need to be issued separately at a later point in time.',
}

type FieldConfig =
  | {
      fieldType: 'balance'
      name: string
      label: string
      currency: string
      decimals: number
      disabled?: boolean
      subLabel?: string
    }
  | {
      fieldType: 'checkbox'
      name: string
      label: string
      disabled?: boolean
      tooltipKey?: keyof typeof tooltipContent
      onChange?: (checked: boolean) => void
    }

export interface FormSectionProps {
  fields: FieldConfig[]
  templateColumns?: string
}

export const FormSection = ({ fields, templateColumns = '1fr 1fr' }: FormSectionProps) => {
  return (
    <Grid gridTemplateColumns={['1fr', '1fr', templateColumns]} gap={6} alignItems="center" mb={4}>
      {fields.map((field) => {
        if (field.fieldType === 'balance') {
          return (
            <BalanceInput
              key={field.name}
              name={field.name}
              label={field.label}
              subLabel={field.subLabel}
              decimals={field.decimals}
              placeholder="0.00"
              inputGroupProps={{
                endAddon: field.currency,
              }}
              disabled={field.disabled}
            />
          )
        }

        if (field.fieldType === 'checkbox') {
          const label = field.tooltipKey ? (
            <Tooltip content={tooltipContent[field.tooltipKey]}>
              <Text textDecoration="underline">{field.label}</Text>
            </Tooltip>
          ) : (
            field.label
          )
          const checkbox = (
            <Checkbox
              name={field.name}
              label={label}
              disabled={field.disabled}
              onChange={(checked) => field.onChange?.(checked)}
            />
          )

          return (
            <Box key={field.name} mt={6}>
              {checkbox}
            </Box>
          )
        }

        return null
      })}
    </Grid>
  )
}
