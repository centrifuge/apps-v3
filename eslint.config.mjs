// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
    'prefer-arrow-callback': 'error',
    'no-new-func': 'error',
    'no-else-return': 'error',
    'arrow-parens': 'off', // taken care of by prettier
    'brace-style': ['off', 'off'],
    'comma-dangle': 'off',
    curly: ['error', 'multi-line'],
    'eol-last': 'off',
    eqeqeq: ['error', 'smart'],
    'id-denylist': 'off',
    'id-match': 'off',
    indent: 'off',
    'linebreak-style': 'off',
    'max-len': 'off',
    'new-parens': 'off',
    'newline-per-chained-call': 'off',
    'no-array-constructor': 'error',
    'no-eval': 'error',
    'no-extra-semi': 'off',
    'no-irregular-whitespace': 'off',
    'no-multiple-empty-lines': 'off',
    'no-new-wrappers': 'error',
    'no-param-reassign': 'error',
    'no-trailing-spaces': 'off',
    'no-underscore-dangle': 'off',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'padded-blocks': [
      'off',
      {
        blocks: 'never',
      },
      {
        allowSingleLineBlocks: true,
      },
    ],
    'prefer-const': 'error',
    'prefer-template': 'error',
    'quote-props': 'off',
    quotes: 'off',
    radix: 'error',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-tag-spacing': [
      'off',
      {
        afterOpening: 'allow',
        closingSlash: 'allow',
      },
    ],
    'react/jsx-wrap-multilines': 'off',
    'react/display-name': 'off',
    semi: 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': ['off', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['function'],
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: ['method'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: ['typeLike'],
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/type-annotation-spacing': 'off',
  },
    ignores: [
      './functions/**',
    ],
}
);