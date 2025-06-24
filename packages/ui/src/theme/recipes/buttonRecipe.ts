import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'semibold',
    borderRadius: '4px',
    borderWidth: '1px',
    _focusVisible: {
      boxShadow: 'outline',
    },
    transition: 'box-shadow 0.2s ease',
    _hover: {
      boxShadow: 'xs',
    },
  },
  variants: {
    size: {
      md: {
        fontSize: 'md',
        px: '16px',
        py: '8px',
        minW: '110px',
        minH: '36px',
      },
    },
    variant: {
      subtle: {
        background: 'gray.100',
        color: 'gray.800',
        fontSize: 'xs',
        fontWeight: 600,
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
