import { BalanceInput, Checkbox } from '@centrifuge/forms'
import { Balance } from '@centrifuge/sdk'
import { BalanceInputDisplay, Button, Tooltip } from '@centrifuge/ui'
import { Box, Flex, Grid, InputElement, Text } from '@chakra-ui/react'

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
      buttonLabel?: string
      onButtonClick?: () => void
    }
  | {
      fieldType: 'checkbox'
      name: string
      label: string
      disabled?: boolean
      tooltipKey?: keyof typeof tooltipContent
      onChange?: (checked: boolean) => void
    }
  | {
      fieldType: 'displayBalance'
      balance: Balance
      currency: string
      decimals: number
      label: string
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
              disabled={field.disabled}
              currency={field.currency}
              buttonLabel={field.buttonLabel}
              onButtonClick={field.onButtonClick}
            />
          )
        }

        if (field.fieldType === 'displayBalance') {
          return (
            <BalanceInputDisplay
              balance={field.balance}
              currency={field.currency}
              decimals={field.decimals}
              label={field.label}
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
