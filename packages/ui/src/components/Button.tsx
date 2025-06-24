import { Button as ChakraButton } from '@chakra-ui/react'
import { ButtonColorPalette, ButtonVariant } from '../types/Button'

export const Button = ({
  colorPalette = 'yellow',
  disabled,
  label,
  onClick,
  variant = 'solid',
  ...props
}: {
  colorPalette?: ButtonColorPalette
  disabled?: boolean
  label: string
  onClick: () => void
  variant?: ButtonVariant
}) => {
  return (
    <ChakraButton
      colorPalette={colorPalette}
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      {...props}
    >
      {label}
    </ChakraButton>
  )
}
